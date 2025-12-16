import { POST as RegisterPOST } from '@/app/api/auth/register/route';
import { POST as LoginPOST } from '@/app/api/auth/login/route';
import { GET as MeGET } from '@/app/api/auth/me/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


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
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock Cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock Bcrypt & JWT (Speed up tests)
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password_123'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake_jwt_token'),
  verify: jest.fn(),
}));

// Mock Env Vars
process.env.JWT_SECRET = "test-secret";

describe('Authentication API Flow', () => {
  let mockCookieStore;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup Cookie Mock
    mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
    };
    cookies.mockResolvedValue(mockCookieStore);
  });

  // TEST SUITE 1: REGISTRATION (POST /api/auth/register)
  
  describe('Registration Flow', () => {
    
    it('fails if fields are missing', async () => {
      const req = {
        json: async () => ({ email: '', password: '' }) // Empty body
      };
      
      const res = await RegisterPOST(req);
      const data = await res.json();
      
      expect(res.status).toBe(400);
      expect(data.error).toBe('All fields are required');
    });

    it('fails if email already exists', async () => {
      const req = {
        json: async () => ({ name: 'Test', email: 'exist@test.com', password: 'password123' })
      };
      
      // Mock DB finding a user
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'exist@test.com' });
      
      const res = await RegisterPOST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Email already in use');
    });

    it('successfully registers a new user', async () => {
      const req = {
        json: async () => ({ name: 'New User', email: 'new@test.com', password: 'password123' })
      };
      
      // Mock DB finding NO user
      prisma.user.findUnique.mockResolvedValue(null);
      
      // Mock DB Creation
      prisma.user.create.mockResolvedValue({
        id: 10,
        name: 'New User',
        email: 'new@test.com',
        passwordHash: 'hashed_password_123'
      });

      const res = await RegisterPOST(req);
      const data = await res.json();

      // Verify Status
      expect(res.status).toBe(201);
      
      // Verify Password Hashing was called
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      
      // Verify DB Create was called with hashed password
      expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          passwordHash: 'hashed_password_123'
        })
      }));
      
      // Verify Response does NOT contain password
      expect(data).not.toHaveProperty('passwordHash');
      expect(data.email).toBe('new@test.com');
    });
  });


  // TEST SUITE 2: LOGIN (POST /api/auth/login)
  
  describe('Login Flow', () => {
    
    it('fails with wrong credentials', async () => {
      const req = {
        json: async () => ({ email: 'wrong@test.com', password: 'wrong' })
      };

      // Mock User Found
      prisma.user.findUnique.mockResolvedValue({ 
        id: 1, 
        email: 'wrong@test.com', 
        passwordHash: 'real_hash' 
      });

      // Mock Bcrypt Compare FALSE
      bcrypt.compare.mockResolvedValue(false);

      const res = await LoginPOST(req);
      expect(res.status).toBe(401);
    });

    it('successfully logs in and sets cookie', async () => {
      const req = {
        json: async () => ({ email: 'valid@test.com', password: 'correct' })
      };

      // Mock User Found
      prisma.user.findUnique.mockResolvedValue({ 
        id: 1, 
        email: 'valid@test.com', 
        passwordHash: 'real_hash',
        role: 'USER'
      });

      // Mock Bcrypt Compare TRUE
      bcrypt.compare.mockResolvedValue(true);

      const res = await LoginPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe('Login successful');

      // VERIFY JWT GENERATION
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'valid@test.com' }),
        'test-secret',
        expect.anything()
      );

      // VERIFY COOKIE SETTING (Crucial!)
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'token',
        'fake_jwt_token',
        expect.objectContaining({
          httpOnly: true,
          path: '/'
        })
      );
    });
  });

 
  // TEST SUITE 3: SESSION CHECK (GET /api/auth/me)

  describe('Session Check Flow', () => {
    
    it('returns 401 if no token cookie exists', async () => {
      // Mock empty cookie store
      mockCookieStore.get.mockReturnValue(undefined);

      const res = await MeGET({});
      expect(res.status).toBe(401);
    });

    it('returns user data if token is valid', async () => {
      // Mock Cookie Found
      mockCookieStore.get.mockReturnValue({ value: 'valid_token' });

      // Mock JWT Verify Success
      jwt.verify.mockReturnValue({ userId: 123 });

      // Mock DB finding user
      prisma.user.findUnique.mockResolvedValue({
        id: 123,
        name: 'Logged In User',
        email: 'test@test.com'
      });

      const res = await MeGET({});
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.name).toBe('Logged In User');
    });
  });

});