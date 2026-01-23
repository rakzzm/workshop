"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, Wrench, Loader2 } from "lucide-react"

export function ServiceHistoryList({ records }: { records: any[] }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const filteredRecords = user?.role === 'ADMIN' 
        ? records 
        : records.filter(record => record.customerId === user?.id)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-muted/50 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Car className="h-5 w-5 text-blue-500" />
                                    {record.vehicle?.regNumber || 'Unknown Vehicle'}
                                </CardTitle>
                                <CardDescription>{record.vehicle?.model || 'N/A'}</CardDescription>
                            </div>
                            <Badge variant={record.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                {record.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-4 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(record.date).toLocaleDateString()}
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Service Type</h4>
                            <div className="text-sm">{record.serviceType || 'General Service'}</div>
                        </div>

                        {record.complaint && (
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Complaint</h4>
                                <div className="text-sm text-muted-foreground line-clamp-2">{record.complaint}</div>
                            </div>
                        )}

                        <div className="pt-2 border-t flex justify-between items-center">
                            <span className="text-sm font-medium">Total Cost</span>
                            <span className="text-lg font-bold">₹{record.totalCost.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {filteredRecords.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Wrench className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No service records found.</p>
                    {user?.role === 'USER' && (
                        <p className="text-sm mt-2">Book a service to see it here!</p>
                    )}
                </div>
            )}
        </div>
    )
}
