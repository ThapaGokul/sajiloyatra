import { POST, DELETE, GET } from '@/app/api/locals/route';
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

jest.mock('nanoid', () => ({
  nanoid: () => 'test_id_123', 
}));

// Mock Next.js Server Response
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init) => ({
      status: init?.status || 200,
      body: body,
      json: async () => body,
    }),
  },
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  localGuide: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}));

// Mock Vercel Blob (File Upload)
jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
}));

// Mock Cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// Mock Env
process.env.JWT_SECRET = "test-secret";

describe('Local Guide API (Host Feature)', () => {
  let mockCookieStore;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieStore = { get: jest.fn() };
    cookies.mockResolvedValue(mockCookieStore);
  });


  // TEST SUITE 1: CREATE PROFILE (POST)
  
  describe('POST /api/locals (Create Profile)', () => {
    
    it('returns 401 if user is not authenticated', async () => {
      // Mock NO token in cookies
      mockCookieStore.get.mockReturnValue(undefined);

      const req = {}; 
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toContain('Not authenticated');
    });

    it('returns 400 if fields are missing', async () => {
      // Mock Valid Token
      mockCookieStore.get.mockReturnValue({ value: 'valid_token' });
      jwt.verify.mockReturnValue({ userId: 123 });

      // Mock FormData with MISSING 'bio' and 'file'
      const formData = new FormData();
      formData.append('name', 'John Doe');


      const req = {
        formData: async () => formData
      };

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('successfully uploads file and creates profile', async () => {
      // 1. Mock Auth
      mockCookieStore.get.mockReturnValue({ value: 'valid_token' });
      jwt.verify.mockReturnValue({ userId: 101 });

      // 2. Mock File & FormData
      const fakeFile = new File(['(⌐■_■)'], 'avatar.png', { type: 'image/png' });
      
      const formData = new FormData();
      formData.append('name', 'Host User');
      formData.append('location', 'Pokhara');
      formData.append('specialty', 'Homestay');
      formData.append('bio', 'I love hosting.');
      formData.append('type', 'HOST');
      formData.append('imageUrl', fakeFile);

      const req = {
        formData: async () => formData
      };

      // 3. Mock Vercel Blob Response
      put.mockResolvedValue({ url: 'https://fake-url.com/avatar.png' });

      // 4. Mock Database Create
      prisma.localGuide.create.mockResolvedValue({
        id: 1,
        name: 'Host User',
        imageUrl: 'https://fake-url.com/avatar.png',
        userId: 101
      });
      const res = await POST(req);
      const data = await res.json();


      expect(res.status).toBe(201);
      
      // Verify File Upload was called
      expect(put).toHaveBeenCalled();
      
      // Verify DB Create was called with Blob URL
      expect(prisma.localGuide.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          name: 'Host User',
          imageUrl: 'https://fake-url.com/avatar.png',
          userId: 101
        })
      }));
    });

    it('returns 400 if user already has a profile', async () => {
      // Mock Auth & Form Data (same as success case)
      mockCookieStore.get.mockReturnValue({ value: 'valid_token' });
      jwt.verify.mockReturnValue({ userId: 101 });
      
      const formData = new FormData();
      formData.append('name', 'User');
      formData.append('location', 'Ktm');
      formData.append('bio', 'bio');
      formData.append('specialty', 'Food');
      formData.append('type', 'HOST');
      formData.append('imageUrl', new File(['a'], 'a.png'));

      const req = { formData: async () => formData };
      
      // Mock Blob Success
      put.mockResolvedValue({ url: 'url' });

      // Mock DB Failure (Unique Constraint)
      const error = new Error('Unique constraint failed');
      error.code = 'P2002'; // Prisma unique error code
      prisma.localGuide.create.mockRejectedValue(error);

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('You already have a host profile.');
    });
  });

  // TEST SUITE 2: DELETE PROFILE (DELETE)
  
  describe('DELETE /api/locals', () => {
    
    it('returns 404 if user tries to delete a non-existent profile', async () => {
      // Mock Auth
      mockCookieStore.get.mockReturnValue({ value: 'valid_token' });
      jwt.verify.mockReturnValue({ email: 'test@test.com' });

      // Mock User Found
      prisma.user.findUnique.mockResolvedValue({ id: 55 });

      // Mock Delete (Nothing deleted)
      prisma.localGuide.deleteMany.mockResolvedValue({ count: 0 });

      const res = await DELETE({});
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.message).toBe('No host profile found.');
    });

    it('successfully deletes the host profile', async () => {
      // Mock Auth
      mockCookieStore.get.mockReturnValue({ value: 'valid_token' });
      jwt.verify.mockReturnValue({ email: 'test@test.com' });

      // Mock User Found
      prisma.user.findUnique.mockResolvedValue({ id: 55 });

      // Mock Delete Success
      prisma.localGuide.deleteMany.mockResolvedValue({ count: 1 });

      const res = await DELETE({});
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe('Host profile deleted successfully.');
      
      // Verify correct user ID was used for deletion
      expect(prisma.localGuide.deleteMany).toHaveBeenCalledWith({
        where: { userId: 55, type: 'HOST' }
      });
    });
  });

 
  // TEST SUITE 3: FETCH HOSTS (GET)
 
  describe('GET /api/locals', () => {
    it('fetches only HOST type guides', async () => {
      // Mock DB Return
      const mockGuides = [
        { id: 1, name: 'Guide A', type: 'HOST' },
        { id: 2, name: 'Guide B', type: 'HOST' }
      ];
      prisma.localGuide.findMany.mockResolvedValue(mockGuides);

      const res = await GET({});
      const data = await res.json();

      expect(data).toHaveLength(2);
      expect(prisma.localGuide.findMany).toHaveBeenCalledWith({
        where: { type: "HOST" }
      });
    });
  });
});