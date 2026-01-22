import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const vehicleCount = await prisma.vehicle.count()
    const partCount = await prisma.part.count()
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@meghcomm.store' },
      select: { email: true, name: true, role: true }
    })

    return NextResponse.json({
      status: 'ok',
      database: {
        users: userCount,
        vehicles: vehicleCount,
        parts: partCount
      },
      adminUserExists: !!adminUser,
      adminUser: adminUser || null,
      credentials: userCount === 0 ? 'Database is empty - visit /api/seed to populate' : {
        admin: 'admin@meghcomm.store / admin123456',
        user: 'user@meghcomm.store / user123456'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
      error: String(error)
    }, { status: 500 })
  }
}
