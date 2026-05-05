"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  TestTube,
  Settings,
  Menu,
  AlertTriangle,
  Bed,
  Building2,
  LogOut,
} from "lucide-react"

const sidebarLinks = [
  { href: "/hospital/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#", label: "Patients", icon: Users },
  { href: "#", label: "Tests", icon: TestTube },
  { href: "#", label: "Settings", icon: Settings },
]

const medicalTests = [
  { name: "Complete Blood Count (CBC)", category: "Hematology", price: 500 },
  { name: "Blood Glucose Test", category: "Biochemistry", price: 300 },
  { name: "Liver Function Test (LFT)", category: "Biochemistry", price: 1200 },
  { name: "Kidney Function Test (KFT)", category: "Biochemistry", price: 1000 },
  { name: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology", price: 1500 },
  { name: "Lipid Profile", category: "Biochemistry", price: 800 },
  { name: "Chest X-Ray", category: "Radiology", price: 600 },
  { name: "ECG (Electrocardiogram)", category: "Cardiology", price: 400 },
  { name: "Urine Routine Examination", category: "Pathology", price: 200 },
  { name: "COVID-19 RT-PCR", category: "Microbiology", price: 2500 },
]

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/medihub-header.png"
            alt="MediHub"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/hospital/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </div>
  )
}

export default function HospitalDashboardPage() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Mock data
  const emergencyQueueCount = 12
  const availableBeds = 45
  const totalBeds = 120

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Hospital Dashboard</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Emergency Queue */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Emergency Queue
                  </CardTitle>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{emergencyQueueCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Patients waiting
                  </p>
                </CardContent>
              </Card>

              {/* Bed Availability */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Bed Availability
                  </CardTitle>
                  <Bed className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {availableBeds} <span className="text-lg font-normal text-muted-foreground">/ {totalBeds}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available beds
                  </p>
                </CardContent>
              </Card>

              {/* Total Beds */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Beds
                  </CardTitle>
                  <Bed className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalBeds}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hospital capacity
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Medical Tests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Tests</CardTitle>
                <CardDescription>
                  List of tests provided by your hospital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price (BDT)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalTests.map((test) => (
                      <TableRow key={test.name}>
                        <TableCell className="font-medium">{test.name}</TableCell>
                        <TableCell>{test.category}</TableCell>
                        <TableCell className="text-right">{test.price.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
