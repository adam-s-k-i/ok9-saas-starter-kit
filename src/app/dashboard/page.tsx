import { AuthGuard } from "@/components/auth/AuthGuard"
import { getDashboardOverview } from "@/lib/dashboard"
import { DashboardContent } from "./_components/dashboard-content-new"

export const revalidate = 0

export default async function DashboardPage() {
  const overview = await getDashboardOverview()

  return (
    <AuthGuard>
      <DashboardContent overview={overview} />
    </AuthGuard>
  )
}
