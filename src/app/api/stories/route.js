import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';



export async function GET(request) {
  try {
    const stories = await prisma.story.findMany();
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Database Error in /api/stories:', error);
    
    return new NextResponse(JSON.stringify({ 
        message: 'Internal Server Error fetching stories.' 
    }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
    });
  }
}