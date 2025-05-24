import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import bcrypt from "bcryptjs";

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
