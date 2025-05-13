import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/email"; // Import the sendEmail utility

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password }: RegisterInput = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    );

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        emailVerificationToken,
        emailVerificationTokenExpires,
      },
    });

    // Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email/${emailVerificationToken}`;

    const emailHtml = `
      <h1>Verify Your Email Address</h1>
      <p>Thanks for signing up! Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html: emailHtml,
    });

    const { passwordHash, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please check your email to verify your account.",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_POST_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
