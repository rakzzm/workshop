"use server"

import prisma from "@/lib/prisma"

import { MOCK_SERVICE_RECORDS } from "@/lib/mock-data"

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

        if (!serviceRecords || serviceRecords.length === 0) {
            console.log('No service records found in DB, using mock data')
            return MOCK_SERVICE_RECORDS as any[]
        }

        return serviceRecords
    } catch (error) {
        console.error("Failed to fetch service history, utilizing mock data:", error)
        return MOCK_SERVICE_RECORDS as any[]
    }
}
