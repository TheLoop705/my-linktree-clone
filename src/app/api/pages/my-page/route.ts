import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } // Find the user's page
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        pages: {
          include: {
            links: {
              orderBy: { position: "asc" },
            },
            theme: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the first page (for MVP, users have one page)
    const userPage = user.pages[0];

    if (!userPage) {
      return NextResponse.json({ error: "No page found" }, { status: 404 });
    }

    return NextResponse.json(userPage);
  } catch (error) {
    console.error("Error fetching user page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
