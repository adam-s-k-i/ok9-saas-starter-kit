import { NextRequest, NextResponse } from "next/server"
import { getDashboardOverview } from "@/lib/dashboard"

export async function GET(request: NextRequest) {
  try {
    const overview = await getDashboardOverview()

    return NextResponse.json(overview)
  } catch (error) {
    console.error("Dashboard overview API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}