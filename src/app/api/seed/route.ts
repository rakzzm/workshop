import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Check if admin user exists
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@meghcomm.store' }
    })

    if (adminExists) {
      return NextResponse.json({
        status: 'already_seeded',
        message: 'Database is already seeded with admin user',
        adminEmail: 'admin@meghcomm.store'
      })
    }

    // Seed admin and user
    const adminPassword = await bcrypt.hash('admin123456', 10)
    const userPassword = await bcrypt.hash('user123456', 10)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@meghcomm.store',
        name: 'Workshop Admin',
        password: adminPassword,
        role: 'ADMIN',
      }
    })

    const user = await prisma.user.create({
      data: {
        email: 'user@meghcomm.store',
        name: 'John Doe',
        password: userPassword,
        role: 'USER',
      }
    })

    return NextResponse.json({
      status: 'seeded',
      message: 'Database seeded successfully',
      users: [
        { email: admin.email, password: 'admin123456' },
        { email: user.email, password: 'user123456' }
      ]
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error: String(error)
    }, { status: 500 })
  }
}
