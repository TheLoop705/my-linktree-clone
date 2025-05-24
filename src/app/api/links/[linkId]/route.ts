import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const updateLinkSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  position: z.number().int().min(0).optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = updateLinkSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { linkId } = params;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the link belongs to the user
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        page: {
          userId: user.id
        }
      }
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found or access denied' },
        { status: 404 }
      );
    }

    // Update the link
    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: validationResult.data
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { linkId } = params;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the link belongs to the user
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        page: {
          userId: user.id
        }
      }
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the link
    await prisma.link.delete({
      where: { id: linkId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
