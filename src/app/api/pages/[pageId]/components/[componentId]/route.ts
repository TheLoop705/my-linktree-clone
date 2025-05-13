import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { prisma } from "@/lib/db/prisma";
import { updatePageComponentSchema } from "@/lib/schemas/pageComponent";
import { Prisma } from "@prisma/client";

// PUT Handler to update a PageComponent
export async function PUT(
  request: Request,
  { params }: { params: { pageId: string; componentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId, componentId } = params;
    if (!pageId || !componentId) {
      return NextResponse.json(
        { message: "Page ID and Component ID are required" },
        { status: 400 }
      );
    }

    // Verify user owns the LinkPage and the component belongs to that page
    const pageComponent = await prisma.pageComponent.findUnique({
      where: { id: componentId },
      include: { linkPage: true },
    });

    if (
      !pageComponent ||
      pageComponent.pageId !== pageId ||
      pageComponent.linkPage.userId !== session.user.id
    ) {
      return NextResponse.json(
        { message: "Component not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updatePageComponentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { order, content, styles } = validation.data;

    // Note: Handling order changes might require re-ordering other components.
    // For MVP, if order is changed, it's directly updated.
    // A more robust solution would involve a transaction to shift other items if necessary.

    const updatedComponent = await prisma.pageComponent.update({
      where: { id: componentId },
      data: {
        ...(order !== undefined && { order }),
        ...(content && { content: content as Prisma.JsonObject }),
        ...(styles !== undefined && {
          styles: styles as Prisma.JsonObject | null,
        }),
      },
    });

    return NextResponse.json(updatedComponent, { status: 200 });
  } catch (error) {
    console.error("[PAGE_COMPONENT_PUT_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE Handler to remove a PageComponent
export async function DELETE(
  request: Request, // request is not used but required by Next.js route handler signature
  { params }: { params: { pageId: string; componentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId, componentId } = params;
    if (!pageId || !componentId) {
      return NextResponse.json(
        { message: "Page ID and Component ID are required" },
        { status: 400 }
      );
    }

    // Verify user owns the LinkPage and the component belongs to that page
    const pageComponent = await prisma.pageComponent.findUnique({
      where: { id: componentId },
      include: { linkPage: true },
    });

    if (
      !pageComponent ||
      pageComponent.pageId !== pageId ||
      pageComponent.linkPage.userId !== session.user.id
    ) {
      return NextResponse.json(
        { message: "Component not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.pageComponent.delete({
      where: { id: componentId },
    });

    return NextResponse.json(
      { message: "Component deleted successfully" },
      { status: 200 } // Some prefer 204 No Content for DELETE
    );
  } catch (error) {
    console.error("[PAGE_COMPONENT_DELETE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
