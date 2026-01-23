import { getServiceHistory } from "@/app/actions/service-history-action"
import { ServiceHistoryList } from "./components/ServiceHistoryList"

export const dynamic = 'force-dynamic'

export default async function ServiceHistoryPage() {
    const records = await getServiceHistory()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Service History</h1>
            <ServiceHistoryList records={records} />
        </div>
    )
}
