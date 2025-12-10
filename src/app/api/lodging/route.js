import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const lodgings = await prisma.lodging.findMany();
  return NextResponse.json(lodgings);
}