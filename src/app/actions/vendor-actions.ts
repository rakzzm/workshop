"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { MOCK_VENDORS } from "@/lib/mock-data"

export async function createVendor(data: any): Promise<{ success: boolean; error?: string; vendor?: any }> {
  try {
    const vendor = await prisma.vendor.create({
      data: {
        vendorId: data.vendorId,
        companyName: data.companyName,
        contactPerson: data.contactPerson || null,
        email: data.email || null,
        phone: data.phone,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
        gstin: data.gstin || null,
        pan: data.pan || null,
        category: data.category || null,
        rating: data.rating || 3.0,
        paymentTerms: data.paymentTerms || null,
        creditLimit: data.creditLimit || null,
        status: data.status || "ACTIVE",
        notes: data.notes || null,
      },
    })
    revalidatePath("/vendors")
    return { success: true, vendor }
  } catch (error) {
    console.warn("Database disconnected (Demo Mode): Using mock vendors.", error)
    // Simulate success for demo
    return { success: true, vendor: { ...data, id: Math.floor(Math.random() * 1000) } }
  }
}

export async function updateVendor(id: number, data: any): Promise<{ success: boolean; error?: string; vendor?: any }> {
  try {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson || null,
        email: data.email || null,
        phone: data.phone,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
        gstin: data.gstin || null,
        pan: data.pan || null,
        category: data.category || null,
        rating: data.rating !== undefined ? data.rating : 3.0,
        paymentTerms: data.paymentTerms || null,
        creditLimit: data.creditLimit || null,
        status: data.status || "ACTIVE",
        notes: data.notes || null,
      },
    })
    revalidatePath("/vendors")
    return { success: true, vendor }
  } catch (error) {
    console.warn("Database disconnected (Demo Mode): Using mock vendors.", error)
    return { success: true, vendor: { ...data, id } }
  }
}

export async function deleteVendor(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if vendor has purchase orders
    const poCount = await prisma.purchaseOrder.count({
      where: { vendorId: id }
    })
    
    if (poCount > 0) {
      return { success: false, error: `Cannot delete vendor with ${poCount} purchase order(s). Please reassign or remove orders first.` }
    }
    
    await prisma.vendor.delete({
      where: { id }
    })
    revalidatePath("/vendors")
    return { success: true }
  } catch (error) {
    console.warn("Database disconnected (Demo Mode): Using mock vendors.", error)
    // Simulate success
    return { success: true }
  }
}

export async function getVendors() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        purchaseOrders: true
      }
    })
    
    if (!vendors || vendors.length === 0) {
        console.warn("No vendors found in DB (or DB error), returning MOCK_VENDORS")
        return MOCK_VENDORS as any
    }
    
    return vendors
  } catch (error) {
    console.warn("Database disconnected (Demo Mode): Using mock vendor data.", error)
    return MOCK_VENDORS as any
  }
}
