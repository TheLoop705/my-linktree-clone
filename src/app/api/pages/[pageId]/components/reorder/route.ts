import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// POST /api/pages/[pageId]/components/reorder
export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = params;
    const { componentIds } = await request.json(); // Array of component IDs in new order

    // Verify user owns this page
    const page = await prisma.linkPage.findFirst({
      where: {
        id: pageId,
        userId: session.user.id,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Update the order of each component
    await Promise.all(
      componentIds.map((componentId: string, index: number) =>
        prisma.pageComponent.update({
          where: {
            id: componentId,
            pageId: pageId,
          },
          data: {
            order: index + 1,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering page components:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
