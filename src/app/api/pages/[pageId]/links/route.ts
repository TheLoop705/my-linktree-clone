import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { isValidUrl } from '@/lib/utils';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth';

// Validation schema for link creation
const createLinkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  url: z.string().url('Invalid URL format').refine(isValidUrl, 'Invalid URL'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  icon: z.string().max(100).optional(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// GET /api/pages/[pageId]/links
export async function GET(
  req: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the page and verify ownership
    const page = await prisma.linkPage.findUnique({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
    });

    if (!page) {
      return NextResponse.json(
        { status: 'error', message: 'Page not found or access denied' },
        { status: 404 }
      );
    }

    // Get all links for the page
    const links = await prisma.link.findMany({
      where: { pageId: params.pageId },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({
      status: 'success',
      data: links,
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST /api/pages/[pageId]/links
export async function POST(
  req: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the page and verify ownership
    const page = await prisma.linkPage.findUnique({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
    });

    if (!page) {
      return NextResponse.json(
        { status: 'error', message: 'Page not found or access denied' },
        { status: 404 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const validationResult = createLinkSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Validation error', 
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Get current highest position for proper ordering
    const highestPositionLink = await prisma.link.findFirst({
      where: { pageId: params.pageId },
      orderBy: { position: 'desc' },
    });

    const newPosition = highestPositionLink ? highestPositionLink.position + 1 : 0;

    // Create the new link
    const newLink = await prisma.link.create({
      data: {
        pageId: params.pageId,
        title: validationResult.data.title,
        url: validationResult.data.url,
        description: validationResult.data.description,
        icon: validationResult.data.icon,
        position: validationResult.data.position ?? newPosition,
        isActive: validationResult.data.isActive ?? true,
        isFeatured: validationResult.data.isFeatured ?? false,
      },
    });

    return NextResponse.json({
      status: 'success',
      data: newLink,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create link' },
      { status: 500 }
    );
  }
}