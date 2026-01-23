"use client"

import { useAuth } from "@/contexts/AuthContext"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { UserDashboard } from "@/components/dashboard/UserDashboard"
import { Loader2 } from "lucide-react"

export function DashboardWrapper({ stats }: { stats: any }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user || user.role === 'ADMIN') {
        return <AdminDashboard stats={stats} />
    }

    return <UserDashboard user={user} />
}
