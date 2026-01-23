"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCustomer(data: any) {
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
    console.error("Create Customer Error:", error)
    // Return the specific error message if it's one we threw
    return { success: false, error: error.message || "Failed to create customer" }
  }
}

export async function updateCustomer(id: number, data: any) {
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
    console.error(error)
    return { success: false, error: "Failed to update customer" }
  }
}

export async function deleteCustomer(id: number) {
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
    console.error(error)
    return { success: false, error: "Failed to delete customer" }
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
    return customers
  } catch (error) {
    console.error(error)
    return []
  }
}
