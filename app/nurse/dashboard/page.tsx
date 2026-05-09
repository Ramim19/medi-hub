"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard } from "lucide-react"

export default function NurseDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Nurse Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Nurse
          </p>
        </div>

        {/* Empty State Card */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Your nurse dashboard is ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <LayoutDashboard className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Dashboard content coming soon</p>
              <p className="text-sm mt-2">
                This dashboard will display your assignments, patient information, and more.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
