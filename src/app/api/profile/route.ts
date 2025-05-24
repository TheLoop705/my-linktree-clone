import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { updateProfileSchema } from "@/lib/schemas/profile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const profile = user.profile;

    return NextResponse.json({
      displayName: profile?.displayName || session.user.name || "",
      bio: profile?.bio || "",
      profession: profile?.profession || "",
      location: profile?.location || "",
      websiteUrl: profile?.websiteUrl || "",
      profileImageUrl: profile?.profileImageUrl || session.user.image || "",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } // Update or create user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: validation.data,
      create: {
        userId: user.id,
        ...validation.data,
      },
    });

    // Note: User table doesn't have a name field, so we only update the profile
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
