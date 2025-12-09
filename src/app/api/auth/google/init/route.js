import { NextResponse } from 'next/server';

export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
  
  const host = request.headers.get('host');
  let protocol = 'http';
  if (process.env.NODE_ENV === 'production' || request.headers.get('x-forwarded-proto') === 'https') {
    protocol = 'https';
  }
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&prompt=select_account`;

  return NextResponse.redirect(url);
}