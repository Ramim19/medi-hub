"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  Stethoscope,
  Clock,
  MapPin,
  DollarSign,
  Edit,
  Calendar,
  Eye,
  Upload,
  FileText,
  User,
  Phone,
  Mail,
  Heart,
  Activity,
  Pill,
  Syringe,
  AlertTriangle,
  Droplet,
  Thermometer,
  Scale,
  Ruler,
  Shield,
  X,
} from "lucide-react"

// Dynamically import map component to avoid SSR issues
const LocationPickerMap = dynamic(() => import("@/components/location-picker-map"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-md aspect-[4/3] rounded-xl border border-border bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading map...</span>
        </div>
      </div>
    </div>
  ),
})

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chamber", label: "Chamber Info", icon: Building2 },
  { id: "patients", label: "Patients", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
]

// Mock patient data
const mockPatients = [
  {
    id: "p1",
    name: "John Doe",
    phone: "+880 1712-345678",
    email: "john.doe@email.com",
    age: 35,
    gender: "Male",
    bloodType: "O+",
    height: "5'10\" (178 cm)",
    weight: "165 lbs (75 kg)",
    bmi: 23.7,
    address: "123 Green Road, Dhaka 1205",
    emergencyContact: { name: "Jane Doe", relation: "Spouse", phone: "+880 1798-765432" },
    vitalSigns: { bloodPressure: "120/80", heartRate: 72, temperature: 98.6, oxygenSaturation: 98 },
    allergies: [
      { name: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
      { name: "Shellfish", severity: "moderate", reaction: "Hives, swelling" },
    ],
    conditions: [
      { name: "Type 2 Diabetes", diagnosedDate: "Jan 2022", status: "managed" },
      { name: "Hypertension", diagnosedDate: "Mar 2021", status: "managed" },
    ],
    medications: [
      { name: "Metformin 500mg", dosage: "Twice daily with meals", prescribedBy: "Dr. Rahman", startDate: "Jan 2022" },
      { name: "Lisinopril 10mg", dosage: "Once daily in morning", prescribedBy: "Dr. Ahmed", startDate: "Mar 2021" },
    ],
    immunizations: [
      { name: "COVID-19 (Pfizer)", date: "Mar 15, 2024", nextDue: "Mar 2025" },
      { name: "Influenza", date: "Oct 10, 2025", nextDue: "Oct 2026" },
    ],
    medicalHistory: [
      { date: "Apr 15, 2026", type: "Consultation", provider: "Dr. Sarah Ahmed", hospital: "Square Hospital", notes: "Routine diabetes checkup. HbA1c levels stable at 6.8%." },
      { date: "Mar 28, 2026", type: "Lab Test", provider: "Labaid Diagnostics", hospital: "Labaid Hospital", notes: "Complete blood count, lipid profile. All values within normal range." },
    ],
  },
  {
    id: "p2",
    name: "Sarah Khan",
    phone: "+880 1812-567890",
    email: "sarah.khan@email.com",
    age: 28,
    gender: "Female",
    bloodType: "A+",
    height: "5'4\" (162 cm)",
    weight: "130 lbs (59 kg)",
    bmi: 22.4,
    address: "456 Gulshan Avenue, Dhaka 1212",
    emergencyContact: { name: "Ahmed Khan", relation: "Brother", phone: "+880 1712-111222" },
    vitalSigns: { bloodPressure: "115/75", heartRate: 68, temperature: 98.4, oxygenSaturation: 99 },
    allergies: [{ name: "Dust mites", severity: "mild", reaction: "Sneezing, congestion" }],
    conditions: [{ name: "Seasonal Allergies", diagnosedDate: "2020", status: "active" }],
    medications: [{ name: "Cetirizine 10mg", dosage: "Once daily as needed", prescribedBy: "Dr. Hassan", startDate: "Apr 2024" }],
    immunizations: [
      { name: "COVID-19 (Moderna)", date: "Feb 20, 2024", nextDue: "Feb 2025" },
      { name: "Tetanus (Tdap)", date: "Jun 5, 2022", nextDue: "Jun 2032" },
    ],
    medicalHistory: [
      { date: "Apr 20, 2026", type: "Consultation", provider: "Dr. Fatima", hospital: "United Hospital", notes: "Seasonal allergy follow-up. Prescribed antihistamines." },
    ],
  },
  {
    id: "p3",
    name: "Rahim Uddin",
    phone: "+880 1912-234567",
    email: "rahim.uddin@email.com",
    age: 45,
    gender: "Male",
    bloodType: "B+",
    height: "5'8\" (173 cm)",
    weight: "180 lbs (82 kg)",
    bmi: 27.4,
    address: "789 Dhanmondi, Dhaka 1205",
    emergencyContact: { name: "Fatima Uddin", relation: "Wife", phone: "+880 1912-987654" },
    vitalSigns: { bloodPressure: "135/85", heartRate: 78, temperature: 98.8, oxygenSaturation: 97 },
    allergies: [],
    conditions: [
      { name: "High Cholesterol", diagnosedDate: "Nov 2023", status: "managed" },
      { name: "Pre-diabetes", diagnosedDate: "Jan 2024", status: "monitoring" },
    ],
    medications: [
      { name: "Atorvastatin 20mg", dosage: "Once daily at night", prescribedBy: "Dr. Rahman", startDate: "Nov 2023" },
    ],
    immunizations: [
      { name: "COVID-19 (AstraZeneca)", date: "Apr 10, 2024", nextDue: "Apr 2025" },
      { name: "Hepatitis B", date: "Complete", nextDue: "N/A" },
    ],
    medicalHistory: [
      { date: "Apr 10, 2026", type: "Lab Test", provider: "Popular Diagnostics", hospital: "Popular Hospital", notes: "Lipid profile test. LDL cholesterol improved from 180 to 140." },
    ],
  },
]

// Types
interface ChamberInfo {
  chamberTime: string
  consultationFee: string
  address: string
  location: { lat: number; lng: number }
}

interface DateAppointments {
  isOpen: boolean
  maxAppointments: number
  patients: { id: string; serialNo: number }[]
}

interface AppointmentData {
  [date: string]: DateAppointments
}

export default function DoctorDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("chamber")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Chamber info state
  const [chamberInfo, setChamberInfo] = useState<ChamberInfo>({
    chamberTime: "9:00 AM - 5:00 PM",
    consultationFee: "1000",
    address: "House 45, Road 10, Gulshan-1, Dhaka 1212",
    location: { lat: 23.7937, lng: 90.4147 },
  })
  const [editChamberOpen, setEditChamberOpen] = useState(false)
  const [editChamberForm, setEditChamberForm] = useState<ChamberInfo>(chamberInfo)
  const [editLocation, setEditLocation] = useState(chamberInfo.location)

  // Appointments state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [appointmentData, setAppointmentData] = useState<AppointmentData>(() => {
    // Initialize with some mock data for today
    const today = new Date().toISOString().split("T")[0]
    return {
      [today]: {
        isOpen: true,
        maxAppointments: 30,
        patients: [
          { id: "p1", serialNo: 1 },
          { id: "p2", serialNo: 2 },
          { id: "p3", serialNo: 3 },
        ],
      },
    }
  })

  // Patient profile modal state
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null)
  const [patientModalOpen, setPatientModalOpen] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("medihub_doctor_logged_in")
    if (!isLoggedIn) {
      router.push("/doctor/login")
      return
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("medihub_doctor_logged_in")
    router.push("/doctor/login")
  }

  // Get current date's appointment data
  const currentDateData = appointmentData[selectedDate] || {
    isOpen: false,
    maxAppointments: 30,
    patients: [],
  }

  const currentAppointments = currentDateData.patients.length
  const maxAppointments = currentDateData.maxAppointments
  const isOpen = currentDateData.isOpen && currentAppointments < maxAppointments

  // Update appointment data for selected date
  const updateDateAppointments = (updates: Partial<DateAppointments>) => {
    setAppointmentData((prev) => ({
      ...prev,
      [selectedDate]: {
        ...currentDateData,
        ...updates,
      },
    }))
  }

  const toggleAppointments = () => {
    const newIsOpen = !currentDateData.isOpen
    updateDateAppointments({ isOpen: newIsOpen })
  }

  const handleMaxAppointmentsChange = (value: string) => {
    const max = parseInt(value) || 0
    const updates: Partial<DateAppointments> = { maxAppointments: max }
    // Auto-close if current >= max
    if (currentAppointments >= max && max > 0) {
      updates.isOpen = false
    }
    updateDateAppointments(updates)
  }

  // Chamber edit handlers
  const handleEditChamber = () => {
    setEditChamberForm(chamberInfo)
    setEditLocation(chamberInfo.location)
    setEditChamberOpen(true)
  }

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setEditLocation({ lat, lng })
  }, [])

  const handleSaveChamber = () => {
    setChamberInfo({
      ...editChamberForm,
      location: editLocation,
    })
    setEditChamberOpen(false)
  }

  // Patient profile handlers
  const handleViewPatient = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId)
    if (patient) {
      setSelectedPatient(patient)
      setPatientModalOpen(true)
      setPrescriptionFile(null)
    }
  }

  const handleSavePrescription = () => {
    // Mock save - just close the modal
    setPatientModalOpen(false)
    setPrescriptionFile(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/medihub-header.png"
            alt="MediHub"
            width={120}
            height={35}
            className="h-8 w-auto"
          />
        </Link>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Stethoscope className="h-4 w-4 text-primary" />
          <span>Doctor Portal</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "chamber") setActiveTab("chamber")
              else if (item.id === "patients") setActiveTab("patients")
              else setActiveTab(item.id)
              setMobileMenuOpen(false)
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              (item.id === "chamber" && activeTab === "chamber") ||
                (item.id === "patients" && activeTab === "patients") ||
                (item.id !== "chamber" && item.id !== "patients" && activeTab === item.id)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card px-4 h-16 flex items-center justify-between lg:justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Dr. Demo User</p>
              <p className="text-xs text-muted-foreground">Doctor Portal</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
          </div>
        </header>

        {/* Main Area with Tabs */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="chamber">Chamber Info</TabsTrigger>
              <TabsTrigger value="patients">Patient Serial List</TabsTrigger>
            </TabsList>

            {/* Chamber Info Tab */}
            <TabsContent value="chamber" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Chamber Information
                    </CardTitle>
                    <CardDescription>Your clinic/chamber details</CardDescription>
                  </div>
                  <Button onClick={handleEditChamber}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Info
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Chamber Time</p>
                        <p className="text-muted-foreground">{chamberInfo.chamberTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Consultation Fee</p>
                        <p className="text-muted-foreground">{chamberInfo.consultationFee} BDT</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-muted-foreground">{chamberInfo.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location on Map
                    </Label>
                    <LocationPickerMap
                      initialLat={chamberInfo.location.lat}
                      initialLng={chamberInfo.location.lng}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Patient Serial List Tab */}
            <TabsContent value="patients" className="space-y-6">
              {/* Date Picker and Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Appointment Settings
                  </CardTitle>
                  <CardDescription>Manage appointments for the selected date</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Picker */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <Label htmlFor="date" className="whitespace-nowrap">
                      Select Date:
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                  </div>

                  {/* Appointment Controls */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="appointments-toggle"
                        checked={currentDateData.isOpen}
                        onCheckedChange={toggleAppointments}
                        disabled={currentAppointments >= maxAppointments && maxAppointments > 0}
                      />
                      <Label htmlFor="appointments-toggle" className="cursor-pointer">
                        {currentDateData.isOpen ? (
                          <Badge className="bg-green-600">Open for Appointments</Badge>
                        ) : (
                          <Badge variant="secondary">Closed for Appointments</Badge>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="max-appointments" className="whitespace-nowrap">
                        Max Appointments:
                      </Label>
                      <Input
                        id="max-appointments"
                        type="number"
                        min="0"
                        value={maxAppointments}
                        onChange={(e) => handleMaxAppointmentsChange(e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>

                  {/* Appointment Count */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Appointments Filled</span>
                      <span className="font-semibold">
                        {currentAppointments} / {maxAppointments}
                      </span>
                    </div>
                    <Progress
                      value={maxAppointments > 0 ? (currentAppointments / maxAppointments) * 100 : 0}
                      className="h-2"
                    />
                    {currentAppointments >= maxAppointments && maxAppointments > 0 && (
                      <p className="text-sm text-destructive">
                        Maximum appointments reached. Appointments automatically closed.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Serial Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Patient Serial List
                  </CardTitle>
                  <CardDescription>
                    Patients scheduled for{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentDateData.patients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No patients scheduled for this date.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">Serial No.</TableHead>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentDateData.patients.map((appointment) => {
                            const patient = mockPatients.find((p) => p.id === appointment.id)
                            if (!patient) return null
                            return (
                              <TableRow key={appointment.id}>
                                <TableCell className="font-medium">
                                  #{appointment.serialNo}
                                </TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewPatient(patient.id)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Edit Chamber Dialog */}
      <Dialog open={editChamberOpen} onOpenChange={setEditChamberOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Chamber Information</DialogTitle>
            <DialogDescription>Update your clinic/chamber details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chamberTime">Chamber Time</Label>
              <Input
                id="chamberTime"
                value={editChamberForm.chamberTime}
                onChange={(e) =>
                  setEditChamberForm({ ...editChamberForm, chamberTime: e.target.value })
                }
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee (BDT)</Label>
              <Input
                id="consultationFee"
                type="text"
                value={editChamberForm.consultationFee}
                onChange={(e) =>
                  setEditChamberForm({ ...editChamberForm, consultationFee: e.target.value })
                }
                placeholder="e.g., 1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editChamberForm.address}
                onChange={(e) =>
                  setEditChamberForm({ ...editChamberForm, address: e.target.value })
                }
                placeholder="Enter chamber address"
              />
            </div>
            <div className="space-y-2">
              <Label>Location on Map</Label>
<LocationPickerMap
                          onLocationChange={handleLocationChange}
                          initialLat={editLocation.lat}
                          initialLng={editLocation.lng}
                          interactive={true}
                        />
              <p className="text-xs text-muted-foreground">
                Move the map to position the pin at your chamber location
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChamberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChamber}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Profile Modal */}
      <Dialog open={patientModalOpen} onOpenChange={setPatientModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Patient Profile & Medical History
            </DialogTitle>
            <DialogDescription>
              View patient information and add prescription
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Patient Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-4 border-card shadow-lg">
                    <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                      {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedPatient.age} years old</span>
                      <span>·</span>
                      <span>{selectedPatient.gender}</span>
                      <span>·</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        <Droplet className="mr-1 h-3 w-3" />
                        {selectedPatient.bloodType}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="flex items-center gap-3 p-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-green-700">
                      Medical records are encrypted and HIPAA compliant
                    </p>
                  </CardContent>
                </Card>

                {/* Personal Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-destructive" />
                      <span>
                        Emergency: {selectedPatient.emergencyContact.name} (
                        {selectedPatient.emergencyContact.relation})
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Vital Signs & Body Metrics */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Activity className="h-4 w-4 text-secondary" />
                        Vital Signs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <Heart className="h-3 w-3 text-red-500" />
                          Blood Pressure
                        </span>
                        <span className="font-medium">
                          {selectedPatient.vitalSigns.bloodPressure} mmHg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <Activity className="h-3 w-3 text-pink-500" />
                          Heart Rate
                        </span>
                        <span className="font-medium">
                          {selectedPatient.vitalSigns.heartRate} bpm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <Thermometer className="h-3 w-3 text-orange-500" />
                          Temperature
                        </span>
                        <span className="font-medium">
                          {selectedPatient.vitalSigns.temperature}°F
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <Droplet className="h-3 w-3 text-blue-500" />
                          Oxygen
                        </span>
                        <span className="font-medium">
                          {selectedPatient.vitalSigns.oxygenSaturation}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Scale className="h-4 w-4 text-chart-3" />
                        Body Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <Ruler className="h-3 w-3 text-muted-foreground" />
                          Height
                        </span>
                        <span className="font-medium">{selectedPatient.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <Scale className="h-3 w-3 text-muted-foreground" />
                          Weight
                        </span>
                        <span className="font-medium">{selectedPatient.weight}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>BMI</span>
                        <span className="font-medium">{selectedPatient.bmi}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Allergies */}
                {selectedPatient.allergies.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Allergies & Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, i) => (
                          <Badge
                            key={i}
                            variant={
                              allergy.severity === "severe"
                                ? "destructive"
                                : allergy.severity === "moderate"
                                ? "default"
                                : "secondary"
                            }
                            className={allergy.severity === "moderate" ? "bg-amber-500" : ""}
                          >
                            {allergy.name} ({allergy.severity})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Conditions */}
                {selectedPatient.conditions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-4 w-4 text-primary" />
                        Medical Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedPatient.conditions.map((condition, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0"
                          >
                            <div>
                              <span className="font-medium">{condition.name}</span>
                              <span className="text-muted-foreground ml-2">
                                (Since {condition.diagnosedDate})
                              </span>
                            </div>
                            <Badge
                              variant={condition.status === "managed" ? "default" : "secondary"}
                              className={condition.status === "managed" ? "bg-green-600" : ""}
                            >
                              {condition.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Medications */}
                {selectedPatient.medications.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Pill className="h-4 w-4 text-primary" />
                        Current Medications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPatient.medications.map((med, i) => (
                          <div key={i} className="rounded-lg border border-border p-3 text-sm">
                            <p className="font-semibold">{med.name}</p>
                            <p className="text-muted-foreground">{med.dosage}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Prescribed by {med.prescribedBy} · Since {med.startDate}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Immunizations */}
                {selectedPatient.immunizations.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Syringe className="h-4 w-4 text-secondary" />
                        Immunizations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedPatient.immunizations.map((vax, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0"
                          >
                            <div>
                              <span className="font-medium">{vax.name}</span>
                              <span className="text-muted-foreground ml-2">({vax.date})</span>
                            </div>
                            {vax.nextDue !== "N/A" ? (
                              <span className="text-xs text-muted-foreground">
                                Next: {vax.nextDue}
                              </span>
                            ) : (
                              <Badge className="bg-green-600">Complete</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Medical History */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-chart-3" />
                      Medical History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPatient.medicalHistory.map((record, i) => (
                        <div key={i} className="relative border-l-2 border-border pl-4 pb-3">
                          <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-primary" />
                          <div className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {record.type}
                              </Badge>
                              <span className="text-muted-foreground">{record.date}</span>
                            </div>
                            <p className="font-medium">
                              {record.provider} · {record.hospital}
                            </p>
                            <p className="text-muted-foreground">{record.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Prescription Upload */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Upload className="h-4 w-4 text-primary" />
                      Add Prescription
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="prescription-file">Upload Prescription (PDF or any file)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="prescription-file"
                          type="file"
                          onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                          className="flex-1"
                        />
                        {prescriptionFile && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPrescriptionFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {prescriptionFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {prescriptionFile.name}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setPatientModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSavePrescription} disabled={!prescriptionFile}>
              Save Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
