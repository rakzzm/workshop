"use client"

import { useState, useEffect } from "react"
import { getAppointments, updateAppointmentStatus } from "@/app/actions/appointment-actions"
import { getVehicles } from "@/app/actions/customer-actions"
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { format } from "date-fns"

export default function AppointmentsPage() {
    const { user } = useAuth()
    const isAdmin = user?.role === 'ADMIN'
    
    // State
    const [appointments, setAppointments] = useState<any[]>([])
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    async function loadData() {
        setLoading(true)
        const apps = await getAppointments()
        if (apps.success) setAppointments(apps.data || [])
        
        // Load vehicles for dropdown
        const v = await getVehicles()
        if (v.success) setVehicles(v.data || [])
        
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    async function handleStatusChange(id: number, newStatus: string) {
        await updateAppointmentStatus(id, newStatus)
        loadData()
    }

    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = 
            app.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            app.vehicle?.regNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
            
        const matchesStatus = statusFilter === "ALL" || app.status === statusFilter
        
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                    <p className="text-muted-foreground">Manage service bookings and schedules.</p>
                </div>
                <NewAppointmentDialog vehicles={vehicles} onSuccess={loadData} />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customer, vehicle..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                       View and manage scheduled services.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                                    </TableRow>
                                ) : filteredAppointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No appointments found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAppointments.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {format(new Date(app.date), 'MMM d, yyyy')}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(app.date), 'h:mm a')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{app.customer?.firstName} {app.customer?.lastName}</span>
                                                    <span className="text-xs text-muted-foreground">{app.customer?.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{app.vehicle?.model}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">{app.vehicle?.regNumber}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{app.serviceType}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    app.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                                    app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                                    'bg-slate-100 text-slate-800 hover:bg-slate-100'
                                                }>
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {isAdmin && app.status === 'PENDING' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                            onClick={() => handleStatusChange(app.id, 'CONFIRMED')}
                                                        >
                                                            Confirm
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleStatusChange(app.id, 'CANCELLED')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                                {isAdmin && app.status === 'CONFIRMED' && (
                                                     <Button 
                                                        size="sm" 
                                                        onClick={() => handleStatusChange(app.id, 'COMPLETED')}
                                                    >
                                                        Mark Done
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
