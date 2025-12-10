import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');

    if (!area) {
      return NextResponse.json({ error: 'Area parameter is required' }, { status: 400 });
    }

   
    const lodgings = await prisma.lodging.findMany({
      where: {
        area: area,
      },
    });

    return NextResponse.json(lodgings);
  } catch (error) {
    console.error("Failed to fetch lodgings by area:", error);
    return NextResponse.json({ error: 'Failed to fetch lodgings' }, { status: 500 });
  }
}