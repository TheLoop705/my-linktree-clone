import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { ComponentType } from "@/types/pageComponents";

// PUT /api/pages/[pageId]/components/[componentId]
export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string; componentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId, componentId } = params;
    const body = await request.json();

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

    // Update component
    const component = await prisma.pageComponent.update({
      where: {
        id: componentId,
        pageId: pageId,
      },
      data: {
        content: JSON.stringify(body.content || {}),
        styles: body.styles ? JSON.stringify(body.styles) : null,
      },
    });

    return NextResponse.json(component);
  } catch (error) {
    console.error("Error updating page component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[pageId]/components/[componentId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string; componentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId, componentId } = params;

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

    // Delete component
    await prisma.pageComponent.delete({
      where: {
        id: componentId,
        pageId: pageId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
