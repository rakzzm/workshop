import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Clock, Shield, Search } from "lucide-react"
import Link from "next/link"

export function UserDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Vehicle</CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Main Vehicle</div>
            <p className="text-xs text-muted-foreground">Check service status</p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link href="/service-history">View History</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Support</div>
            <p className="text-xs text-muted-foreground">Open a ticket or ask detailed questions</p>
            <Button asChild className="mt-4 w-full" variant="outline">
                <Link href="/support">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
           </CardHeader>
           <CardContent>
            <div className="text-2xl font-bold">Appointments</div>
            <p className="text-xs text-muted-foreground">No upcoming bookings</p>
            <Button variant="outline" className="mt-4 w-full" disabled>
                Book Service (Coming Soon)
            </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
