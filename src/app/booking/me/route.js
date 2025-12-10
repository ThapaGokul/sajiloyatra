import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';


export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        lodging: true, 
      },
      orderBy: {
        checkIn: 'desc', 
      },
    });

    return NextResponse.json(bookings, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 401 });
  }
}