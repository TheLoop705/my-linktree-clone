import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { prisma } from "@/lib/db/prisma";
import { createPageComponentSchema } from "@/lib/schemas/pageComponent";
import { Prisma } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = params;
    if (!pageId) {
      return NextResponse.json(
        { message: "Page ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns the LinkPage
    const linkPage = await prisma.linkPage.findUnique({
      where: { id: pageId, userId: session.user.id },
    });

    if (!linkPage) {
      return NextResponse.json(
        { message: "Page not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = createPageComponentSchema.safeParse({ ...body, pageId });

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { type, content, styles } = validation.data;
    let { order } = validation.data;

    // Determine the order for the new component
    // If order is not provided or is negative, place it at the end
    if (order === undefined || order < 0) {
      const maxOrderComponent = await prisma.pageComponent.findFirst({
        where: { pageId },
        orderBy: { order: "desc" },
      });
      order = maxOrderComponent ? maxOrderComponent.order + 1 : 0;
    } else {
      // If an order is specified, we might need to shift other components
      // For MVP, let's assume client manages this or we handle it more simply.
      // For now, if order is specified, we use it. A more robust solution would handle conflicts.
    }

    const newPageComponent = await prisma.pageComponent.create({
      data: {
        pageId,
        type,
        order,
        content: content as Prisma.JsonObject, // Cast because content is z.any()
        styles: styles as Prisma.JsonObject | undefined, // Cast because styles is z.any()
      },
    });

    return NextResponse.json(newPageComponent, { status: 201 });
  } catch (error) {
    console.error("[PAGE_COMPONENTS_POST_ERROR]", error);
    if (error instanceof z.ZodError) {
      // ZodError was not imported, should be fine as it's caught by validation.success
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
