import { getDashboardStats } from "@/app/actions/dashboard-actions"
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper"

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const stats = await getDashboardStats()

  return <DashboardWrapper stats={stats} />
}
