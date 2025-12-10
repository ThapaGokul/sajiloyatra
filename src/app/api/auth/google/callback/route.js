import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  const host = request.headers.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google Token Error:", tokenData);
      return NextResponse.json({ error: 'Failed to verify with Google' }, { status: 400 });
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await profileResponse.json();

    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        googleId: googleUser.id,
        avatarUrl: googleUser.picture,
        name: googleUser.name 
      },
      create: {
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        avatarUrl: googleUser.picture,
        passwordHash: "",
      },
    });

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

   
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });


    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    console.error("Social Login Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}