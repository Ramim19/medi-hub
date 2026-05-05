"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LayoutDashboard,
  User,
  MapPin,
  Calendar,
  FileText,
  TestTube,
  Bell,
  Settings,
  LogOut,
  Menu,
  Shield,
  Heart,
  Stethoscope,
  Cross,
  ChevronDown,
} from "lucide-react"

// Mock patients data
const patients = [
  {
    id: "patient-1",
    name: "John Doe",
    initials: "JD",
    avatar: "/placeholder-avatar.jpg",
  },
  {
    id: "patient-2",
    name: "Sarah Ahmed",
    initials: "SA",
    avatar: "/placeholder-avatar-2.jpg",
  },
  {
    id: "patient-3",
    name: "Rahim Khan",
    initials: "RK",
    avatar: "/placeholder-avatar-3.jpg",
  },
]

function SidebarContent({ pathname, patientId }: { pathname: string; patientId: string }) {
  const sidebarLinks = [
    { href: `/dashboard/${patientId}`, label: "Overview", icon: LayoutDashboard },
    { href: `/dashboard/${patientId}/profile`, label: "Medical Profile", icon: User },
    { href: `/dashboard/${patientId}/hospitals`, label: "Nearby Hospitals", icon: MapPin },
    { href: `/dashboard/${patientId}/doctors`, label: "Find Doctors", icon: Stethoscope },
    { href: `/dashboard/${patientId}/nurses`, label: "Find Nurses", icon: Cross },
    { href: `/dashboard/${patientId}/appointments`, label: "Appointments", icon: Calendar },
    { href: `/dashboard/${patientId}/tests`, label: "Medical Tests", icon: TestTube },
    { href: `/dashboard/${patientId}/reports`, label: "Test Reports", icon: FileText },
  ]

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
              key={link.href}
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
        <div className="rounded-lg bg-accent/50 p-4">
          <div className="flex items-center gap-2 text-secondary">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-semibold">HIPAA Compliant</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Your health data is encrypted and protected with industry-leading security standards.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const patientId = params.patientId as string
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentPatient = patients.find((p) => p.id === patientId) || patients[0]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:block">
        <SidebarContent pathname={pathname} patientId={patientId} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname} patientId={patientId} />
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
            <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
              <Heart className="h-4 w-4 text-secondary" />
              <span>Your health, our priority</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Patient Selector */}
            <Select
              value={patientId}
              onValueChange={(value) => {
                // Navigate to the same page but with new patient ID
                const currentPath = pathname.replace(`/dashboard/${patientId}`, `/dashboard/${value}`)
                window.location.href = currentPath
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">{patient.initials}</AvatarFallback>
                      </Avatar>
                      <span>{patient.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentPatient.avatar} alt={currentPatient.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentPatient.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium md:inline-block">{currentPatient.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${patientId}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
