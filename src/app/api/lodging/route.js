import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const lodgings = await prisma.lodging.findMany();
  return NextResponse.json(lodgings);
}