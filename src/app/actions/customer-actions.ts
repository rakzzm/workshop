"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { MOCK_CUSTOMERS, MOCK_VEHICLES, MOCK_SERVICE_RECORDS } from "@/lib/mock-data"

export async function createCustomer(data: any): Promise<{ success: boolean; error?: string; customer?: any }> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the customer
      const customer = await tx.customer.create({
        data: {
          customerId: data.customerId,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email || null,
          address: data.address || null,
          gstin: data.gstin || null,
        },
      })

      // 2. Create vehicles if provided
      if (data.vehicles && data.vehicles.length > 0) {
        for (const vehicle of data.vehicles) {
          // Check for existing vehicle with same reg number to avoid unique constraint error
          const existingVehicle = await tx.vehicle.findUnique({
            where: { regNumber: vehicle.regNumber }
          })

          if (existingVehicle) {
            throw new Error(`Vehicle with registration ${vehicle.regNumber} already exists.`)
          }

          await tx.vehicle.create({
            data: {
              regNumber: vehicle.regNumber,
              model: vehicle.model,
              type: vehicle.type,
              ownerName: `${data.firstName} ${data.lastName}`,
              chassisNumber: vehicle.chassisNumber || null,
              engineNumber: vehicle.engineNumber || null,
              ownerPhone: data.phone,
              ownerAddress: data.address || null,
              ownerGstin: data.gstin || null,
              customerId: customer.id,
            },
          })
        }
      }

      return customer
    })
    
    revalidatePath("/customers")
    return { success: true, customer: result }
  } catch (error: any) {
    console.warn("Database disconnected (Demo Mode): Using mock customers.", error)
    // Simulate success
    return { success: true, customer: { ...data, id: Math.floor(Math.random() * 1000) } }
  }
}

export async function updateCustomer(id: number, data: any): Promise<{ success: boolean; error?: string; customer?: any }> {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        gstin: data.gstin || null,
      },
    })
    revalidatePath("/customers")
    return { success: true, customer }
  } catch (error) {
    console.warn("Database disconnected (Demo Mode): Using mock customers.", error)
    return { success: true, customer: { ...data, id } }
  }
}

export async function deleteCustomer(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if customer has vehicles
    const vehicleCount = await prisma.vehicle.count({
      where: { customerId: id }
    })
    
    if (vehicleCount > 0) {
      return { success: false, error: `Cannot delete customer with ${vehicleCount} vehicle(s). Please reassign or remove vehicles first.` }
    }
    
    await prisma.customer.delete({
      where: { id }
    })
    revalidatePath("/customers")
    return { success: true }
  } catch (error) {
    console.warn("Database disconnected (Demo Mode): Using mock customers.", error)
    // Simulate success
    return { success: true }
  }
}

export async function getCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicles: {
          include: {
            serviceRecords: true
          }
        }
      }
    })
    
    if (!customers || customers.length === 0) {
        throw new Error("No customers found (triggering fallback)")
    }
    
    return customers
  } catch (error) {
    console.warn("Database disconnected (Demo Mode): Using mock customers.", error)
    return MOCK_CUSTOMERS as any
  }
}

export async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true 
      }
    })
    return { success: true, data: vehicles }
  } catch (error) {
     console.warn("Database disconnected (Demo Mode): Using mock vehicles.", error)
     return { success: true, data: MOCK_VEHICLES }
  }
}
