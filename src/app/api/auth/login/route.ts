import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hardcoded credentials for Vercel (no database needed)
const HARDCODED_USERS = [
  {
    id: 'admin-001',
    email: 'admin@meghcomm.store',
    name: 'Workshop Admin',
    password: 'admin123456',
    role: 'ADMIN'
  },
  {
    id: 'user-001',
    email: 'user@meghcomm.store',
    name: 'John Doe',
    password: 'user123456',
    role: 'USER'
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let user = null;

    // Try database first
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.log('Database not available, using hardcoded credentials');
      
      // Fallback to hardcoded users (for Vercel)
      user = HARDCODED_USERS.find(u => u.email === email);
    }

    // Validate password (plain text comparison)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'Login failed', 
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}
