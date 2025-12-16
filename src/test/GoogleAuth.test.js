import { GET as LoginGET } from '@/app/api/auth/google/init/route';
import { GET as CallbackGET } from '@/app/api/auth/google/callback/route';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
    redirect: (url) => ({
      status: 307,
      headers: { 
        get: (key) => key === 'location' ? String(url) : null 
      },
    }),
  },
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  user: {
    upsert: jest.fn(),
  },
}));

// Mock Next.js Cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock Global Fetch
global.fetch = jest.fn();

// Mock Environment Variables
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-secret";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.NODE_ENV = "test"; 

describe('Google OAuth Flow', () => {
  let mockCookieStore;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieStore = { set: jest.fn() };
    cookies.mockResolvedValue(mockCookieStore);
  });

  // LOGIN ROUTE 
  describe('GET /api/auth/google/login', () => {
    it('redirects to Google OAuth URL with correct parameters', async () => {
      const req = {
        headers: { get: (key) => key === 'host' ? 'localhost:3000' : null },
        url: 'http://localhost:3000/api/auth/google/login',
      };

      const response = await LoginGET(req);

      expect(response.status).toBe(307);
      
      const location = response.headers.get('location');
      const redirectUrl = new URL(location);
      
      expect(redirectUrl.hostname).toBe('accounts.google.com');
      expect(redirectUrl.searchParams.get('client_id')).toBe('test-google-client-id');
      expect(redirectUrl.searchParams.get('redirect_uri')).toBe('http://localhost:3000/api/auth/google/callback');
    });
  });

  // CALLBACK ROUTE 
  describe('GET /api/auth/google/callback', () => {
    
    it('returns 400 if no code is provided', async () => {
      const req = {
        url: 'http://localhost:3000/api/auth/google/callback', 
        headers: { get: () => 'localhost:3000' }
      };

      const response = await CallbackGET(req);
      const json = await response.json(); 

      expect(response.status).toBe(400);
      expect(json.error).toBe('No code provided');
    });

    it('successfully processes login', async () => {
      const req = {
        url: 'http://localhost:3000/api/auth/google/callback?code=fake_auth_code',
        headers: { get: () => 'localhost:3000' }
      };

      // Mock Google Token Response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'fake_access_token' }),
      });

      // Mock Google Profile Response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'google_123',
          email: 'test@gmail.com',
          name: 'Test User',
          picture: 'http://avatar.url',
        }),
      });

      // Mock Prisma Response
      prisma.user.upsert.mockResolvedValue({
        id: 'user_1',
        email: 'test@gmail.com',
        name: 'Test User',
      });

      const response = await CallbackGET(req);

      // Verify Redirect happened
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/');

      // Verify Cookie Set
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'token', 
        expect.any(String), 
        expect.objectContaining({ httpOnly: true })
      );
    });

    it('handles Google API errors gracefully', async () => {
      const req = {
        url: 'http://localhost:3000/api/auth/google/callback?code=bad_code',
        headers: { get: () => 'localhost:3000' }
      };

      // Mock Token Exchange Failure
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'invalid_grant' }),
      });

      const response = await CallbackGET(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe('Failed to verify with Google');
    });
  });
});