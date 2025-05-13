import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { prisma } from "@/lib/db/prisma";
import { reorderPageComponentsSchema } from "@/lib/schemas/pageComponent";

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
    // We pass pageId from params to the schema for validation, though it's also in the URL
    const validation = reorderPageComponentsSchema.safeParse({
      ...body,
      pageId,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input for reordering",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { components } = validation.data;

    // Perform updates in a transaction
    const updateTransactions = components.map((component) =>
      prisma.pageComponent.updateMany({
        where: {
          id: component.id,
          pageId: pageId, // Ensure the component belongs to the specified page
          linkPage: {
            userId: session.user.id, // Double-check ownership at the component level for safety
          },
        },
        data: {
          order: component.order,
        },
      })
    );

    await prisma.$transaction(updateTransactions);

    return NextResponse.json(
      { message: "Components reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PAGE_COMPONENTS_REORDER_POST_ERROR]", error);
    // Add specific error handling if needed, e.g., for transaction failures
    return NextResponse.json(
      { message: "Internal server error during reorder" },
      { status: 500 }
    );
  }
}
