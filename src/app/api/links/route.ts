import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const createLinkSchema = z.object({
  pageId: z.string().uuid(),
  title: z.string().min(1).max(100),
  url: z.string().url(),
  description: z.string().optional(),
  position: z.number().int().min(0).default(0)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = createLinkSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { pageId, title, url, description, position } = validationResult.data;

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

    // Verify the page belongs to the user
    const page = await prisma.linkPage.findFirst({
      where: {
        id: pageId,
        userId: user.id
      }
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found or access denied' },
        { status: 404 }
      );
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        pageId,
        title,
        url,
        description,
        position,
        isActive: true
      }
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
