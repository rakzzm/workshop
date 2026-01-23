"use client"

import { useState } from "react"
import { createAppointment } from "@/app/actions/appointment-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface NewAppointmentDialogProps {
    vehicles: any[]
    onSuccess: () => void
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function NewAppointmentDialog({ vehicles, onSuccess, trigger, open: controlledOpen, onOpenChange }: NewAppointmentDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const isOpen = isControlled ? controlledOpen : internalOpen
    
    const setOpen = (val: boolean) => {
        if (onOpenChange) onOpenChange(val)
        if (!isControlled) setInternalOpen(val)
    }

    const [formData, setFormData] = useState({
        serviceType: "",
        date: "",
        time: "09:00",
        vehicleId: "",
        notes: ""
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        
        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString()
        
        const vehicleIdInt = parseInt(formData.vehicleId)
        // Find vehicle owner if possible, defaulting to current customer logic if needed
        
        await createAppointment({
            serviceType: formData.serviceType,
            date: dateTime,
            vehicleId: vehicleIdInt,
            customerId: vehicles.find(v => v.id === vehicleIdInt)?.customerId, // Try to link owner
            notes: formData.notes
        })
        
        setOpen(false)
        setFormData({ serviceType: "", date: "", time: "09:00", vehicleId: "", notes: "" })
        onSuccess()
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> New Appointment</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Service Appointment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Vehicle</Label>
                        <Select 
                            onValueChange={(val) => setFormData({...formData, vehicleId: val})}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicles.map(v => (
                                    <SelectItem key={v.id} value={v.id.toString()}>
                                        {v.regNumber} - {v.model} ({v.ownerName})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Select 
                            onValueChange={(val) => setFormData({...formData, serviceType: val})}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Service..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General Service">General Service (PMS)</SelectItem>
                                <SelectItem value="Oil Change">Oil Change</SelectItem>
                                <SelectItem value="Inspection">General Inspection</SelectItem>
                                <SelectItem value="Repair">Repair Work</SelectItem>
                                <SelectItem value="Washing">Washing / Detailing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input 
                                type="date" 
                                required 
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input 
                                type="time" 
                                required 
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input 
                            placeholder="Any specific requests?" 
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Confirm Booking</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
