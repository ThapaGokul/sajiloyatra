import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';  
import { cookies } from 'next/headers';


export async function GET(request) {
  try {
    const guides = await prisma.localGuide.findMany({
      where: { type: "HOST" }
    });
    return NextResponse.json(guides);
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    return NextResponse.json({ error: 'Failed to fetch local guides' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated. Please log in.' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }
    
    const userId = decodedToken.userId;

    const formData = await request.formData();
    const file = formData.get('imageUrl');
    const name = formData.get('name');
    const location = formData.get('location');
    const specialty = formData.get('specialty');
    const bio = formData.get('bio');
    const type = formData.get('type'); 

    if (!file || !name || !location || !bio || !type || !specialty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // UPLOAD THE FILE 
    const uniqueFilename = `${nanoid(8)}-${file.name}`;
    const blob = await put(uniqueFilename, file, {
      access: 'public',
    });

    // SAVE TO DATABASE 
    const newGuide = await prisma.localGuide.create({
      data: {
        name,
        location,
        bio,
        specialty,
        type,
        imageUrl: blob.url,
        userId: userId, 
      },
    });

    return NextResponse.json(newGuide, { status: 201 });

  } catch (error) {
    console.error("Failed to create guide:", error);
    // Check for a unique constraint error (if user already has a profile)
    if (error.code === 'P2002') {
    return NextResponse.json({ error: 'You already have a host profile.' }, { status: 400 });
  }

  return NextResponse.json({ error: 'Failed to create new guide' }, { status: 500 });
}
}