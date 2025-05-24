import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the incoming request for debugging
    console.log("Registration attempt:", {
      email: body.email,
      hasPassword: !!body.password,
    });

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      console.log("Validation errors:", errors);

      return NextResponse.json(
        {
          message: "Please fix the following errors",
          errors: errors,
          details:
            "Make sure your password has at least 8 characters, includes uppercase and lowercase letters, and contains at least one number.",
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

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });

    const { passwordHash, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User registered successfully.",
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
