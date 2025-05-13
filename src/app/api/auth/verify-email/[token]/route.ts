import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is missing" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    if (
      !user.emailVerificationTokenExpires ||
      new Date() > new Date(user.emailVerificationTokenExpires)
    ) {
      // Optionally, resend verification email or prompt user to request a new one
      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null, // Clear the token
        emailVerificationTokenExpires: null, // Clear token expiry
        updatedAt: new Date(),
      },
    });

    // Optionally, redirect to a success page or login page
    // For now, return a success message
    return NextResponse.json(
      { message: "Email verified successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VERIFY_EMAIL_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error during email verification" },
      { status: 500 }
    );
  }
}
