import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lodgingId = searchParams.get('id');

    if (!lodgingId) {
      return NextResponse.json({ error: 'Lodging ID is required' }, { status: 400 });
    }

    //Find the specific lodging
    const lodging = await prisma.lodging.findUnique({
      where: {
        id: parseInt(lodgingId),
      },
    
      include: {
        rooms: true, 
      },
    });

    if (!lodging) {
      return NextResponse.json({ error: 'Lodging not found' }, { status: 404 });
    }

    return NextResponse.json(lodging);
  } catch (error) {
    console.error("Failed to fetch lodging details:", error);
    return NextResponse.json({ error: 'Failed to fetch lodging details' }, { status: 500 });
  }
}