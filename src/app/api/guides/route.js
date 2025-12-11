import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken'; 
import { cookies } from 'next/headers';


export async function GET(request) {
  try {
    const guides = await prisma.localGuide.findMany({
      where: {
        type: "PROFESSIONAL"
      }
    });
    return NextResponse.json(guides);
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    return NextResponse.json({ error: 'Failed to fetch professional guides' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // 1. Get the 'token' cookie (Await it for Next.js 15)
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
    }

    // 2. Verify the JWT Token
    // This decodes the token we created in your Login/Google route
    let decoded;
    try {
      decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true } // We only need the ID
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Delete the guide profile 
    const result = await prisma.localGuide.deleteMany({
      where: {
        userId: user.id,
        type: "PROFESSIONAL"
      }
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "No guide profile found to delete." }, { status: 404 });
    }

    return NextResponse.json({ message: "Guide profile deleted successfully." });

  } catch (error) {
    console.error("Delete guide error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}