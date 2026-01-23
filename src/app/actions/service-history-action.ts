"use server"

import prisma from "@/lib/prisma"

export async function getServiceHistory() {
    try {
        //  Since middleware already protects the route, we can fetch all service records
        //  Role-based filtering can be done client-side if needed
        const serviceRecords = await prisma.serviceRecord.findMany({
            include: {
                vehicle: true,
                mechanic: true,
                parts: {
                    include: {
                        part: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        })

        return serviceRecords
    } catch (error) {
        console.error("Failed to fetch service history:", error)
        return []
    }
}
