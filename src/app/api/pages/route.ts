import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const createPageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Slug can only contain letters, numbers, hyphens, and underscores"
    ),
  title: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createPageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { slug, title, description, isPublic } = validationResult.data;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if slug is already taken
    const existingPage = await prisma.linkPage.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Slug already taken" },
        { status: 400 }
      );
    }

    // Create the page
    const page = await prisma.linkPage.create({
      data: {
        userId: user.id,
        slug,
        title,
        description,
        isPublic,
      },
      include: {
        links: {
          orderBy: { position: "asc" },
        },
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
