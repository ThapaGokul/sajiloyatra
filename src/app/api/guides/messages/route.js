import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the guide profile for this user, AND include their messages
    const guide = await prisma.localGuide.findUnique({
      where: { userId: decoded.userId },
      include: { 
        messages: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!guide) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json(guide.messages);

  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}