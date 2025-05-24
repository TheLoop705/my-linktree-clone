import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const updatePageSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().optional(),
  theme: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = params;
    const body = await request.json();
    const validation = updatePageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the page belongs to the user
    const page = await prisma.linkPage.findFirst({
      where: {
        id: pageId,
        userId: user.id,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const { theme, ...pageData } = validation.data;

    // Update the page
    const updatedPage = await prisma.linkPage.update({
      where: { id: pageId },
      data: pageData,
    });

    // Handle theme update if provided
    if (theme !== undefined) {
      await prisma.pageTheme.upsert({
        where: { pageId },
        update: { themeName: theme },
        create: {
          pageId,
          themeName: theme,
        },
      });
    }

    return NextResponse.json({ success: true, page: updatedPage });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add PATCH method support
export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  return PUT(request, { params });
}
