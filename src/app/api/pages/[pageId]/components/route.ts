import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { ComponentType } from "@/types/pageComponents";

// GET /api/pages/[pageId]/components
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { pageId } = params;

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

    // Fetch components ordered by their order field
    const components = await prisma.pageComponent.findMany({
      where: { pageId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching page components:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/pages/[pageId]/components
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

    // Get the next order number
    const lastComponent = await prisma.pageComponent.findFirst({
      where: { pageId },
      orderBy: { order: "desc" },
    });

    const nextOrder = (lastComponent?.order ?? 0) + 1; // Create new component
    const component = await prisma.pageComponent.create({
      data: {
        pageId,
        type: body.type as ComponentType,
        order: nextOrder,
        content: JSON.stringify(body.content || {}),
        styles: body.styles ? JSON.stringify(body.styles) : null,
      },
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error("Error creating page component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
