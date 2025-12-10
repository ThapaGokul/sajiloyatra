import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {

  const cookieStore = await cookies();
  
  // Set the token to an empty string and expire it immediately
  cookieStore.set('token', '', {
    httpOnly: true,
    expires: new Date(0), // Sets expiration to the past
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return NextResponse.json({ message: 'Logged out successfully' });
}