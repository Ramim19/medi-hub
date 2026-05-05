"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  TestTube,
  Settings,
  Menu,
  AlertTriangle,
  Bed,
  Building2,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  CheckCircle,
  FileText,
  UserPlus,
} from "lucide-react"

// Types
interface MedicalTest {
  id: string
  testType: string
  testName: string
  description: string
  timeAvailable: string
  cost: string
  preparationInstructions: string
}

interface ReportFile {
  name: string
  uploadedAt: string
}

interface PendingPatient {
  id: string
  patientName: string
  testName: string
  dateBooked: string
  uploadedFiles: ReportFile[]
}

interface CompletedPatient {
  id: string
  patientName: string
  testName: string
  dateCompleted: string
  reportFiles: ReportFile[]
}

interface EmergencyPatient {
  id: string
  patientName: string
  ticketNumber: string
  status: "in progress" | "completed"
  createdAt: string
}

interface HospitalBed {
  id: string
  bedNumber: string
  bedType: "Ward" | "Cabin" | "ICU"
  status: "Available" | "Occupied"
  assignedPatient: string | null
}

const testTypes = [
  "Blood Tests",
  "Imaging & Scans",
  "Cardiac Tests",
  "Pathology",
  "Hormone Tests",
  "Allergy Tests",
]

const bedTypes = ["Ward", "Cabin", "ICU"] as const

const initialTests: MedicalTest[] = [
  {
    id: "1",
    testType: "Blood Tests",
    testName: "Complete Blood Count (CBC)",
    description: "Measures different components of blood including red cells, white cells, and platelets.",
    timeAvailable: "Sunday to Thursday 8AM–4PM",
    cost: "500",
    preparationInstructions: "Fasting for 8-12 hours recommended.",
  },
  {
    id: "2",
    testType: "Imaging & Scans",
    testName: "Chest X-Ray",
    description: "Imaging test to examine the lungs, heart, and chest wall.",
    timeAvailable: "Saturday to Thursday 9AM–5PM",
    cost: "600",
    preparationInstructions: "Remove jewelry and metal objects. Wear loose clothing.",
  },
  {
    id: "3",
    testType: "Cardiac Tests",
    testName: "ECG (Electrocardiogram)",
    description: "Records the electrical activity of the heart.",
    timeAvailable: "Sunday to Thursday 10AM–2PM",
    cost: "400",
    preparationInstructions: "No special preparation required.",
  },
  {
    id: "4",
    testType: "Hormone Tests",
    testName: "Thyroid Profile (T3, T4, TSH)",
    description: "Measures thyroid hormone levels to assess thyroid function.",
    timeAvailable: "Sunday to Wednesday 8AM–12PM",
    cost: "1500",
    preparationInstructions: "Morning sample preferred. Inform about any thyroid medications.",
  },
]

const initialPendingPatients: PendingPatient[] = [
  {
    id: "p1",
    patientName: "Rahim Ahmed",
    testName: "Complete Blood Count (CBC)",
    dateBooked: "2024-01-15",
    uploadedFiles: [],
  },
  {
    id: "p2",
    patientName: "Fatima Khan",
    testName: "Thyroid Profile (T3, T4, TSH)",
    dateBooked: "2024-01-14",
    uploadedFiles: [],
  },
  {
    id: "p3",
    patientName: "Karim Hossain",
    testName: "Chest X-Ray",
    dateBooked: "2024-01-13",
    uploadedFiles: [],
  },
]

const initialCompletedPatients: CompletedPatient[] = [
  {
    id: "c1",
    patientName: "Nasreen Begum",
    testName: "ECG (Electrocardiogram)",
    dateCompleted: "2024-01-12",
    reportFiles: [{ name: "ECG_Report.pdf", uploadedAt: "2024-01-12" }],
  },
]

const initialEmergencyPatients: EmergencyPatient[] = [
  {
    id: "e1",
    patientName: "Abdul Rahman",
    ticketNumber: "EM-001",
    status: "in progress",
    createdAt: "2024-01-15",
  },
  {
    id: "e2",
    patientName: "Salma Akter",
    ticketNumber: "EM-002",
    status: "in progress",
    createdAt: "2024-01-15",
  },
]

const initialBeds: HospitalBed[] = [
  { id: "b1", bedNumber: "W-101", bedType: "Ward", status: "Available", assignedPatient: null },
  { id: "b2", bedNumber: "W-102", bedType: "Ward", status: "Occupied", assignedPatient: "Mohammad Ali" },
  { id: "b3", bedNumber: "C-201", bedType: "Cabin", status: "Available", assignedPatient: null },
  { id: "b4", bedNumber: "C-202", bedType: "Cabin", status: "Occupied", assignedPatient: "Rahima Begum" },
  { id: "b5", bedNumber: "ICU-01", bedType: "ICU", status: "Available", assignedPatient: null },
  { id: "b6", bedNumber: "ICU-02", bedType: "ICU", status: "Occupied", assignedPatient: "Jamal Uddin" },
]

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tests", label: "Medical Tests", icon: TestTube },
  { id: "settings", label: "Settings", icon: Settings },
]

function SidebarContent({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
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
          const isActive = activeTab === link.id
          return (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </button>
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Emergency Queue state
  const [emergencyPatients, setEmergencyPatients] = useState<EmergencyPatient[]>(initialEmergencyPatients)
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false)
  const [emergencyPatientName, setEmergencyPatientName] = useState("")
  const [ticketCounter, setTicketCounter] = useState(3)

  // Bed Management state
  const [beds, setBeds] = useState<HospitalBed[]>(initialBeds)
  const [bedDialogOpen, setBedDialogOpen] = useState(false)
  const [bedForm, setBedForm] = useState({ bedNumber: "", bedType: "Ward" as "Ward" | "Cabin" | "ICU" })
  const [assignPatientDialogOpen, setAssignPatientDialogOpen] = useState(false)
  const [assigningBedId, setAssigningBedId] = useState<string | null>(null)
  const [assignPatientName, setAssignPatientName] = useState("")

  // Computed dashboard stats (auto-updating)
  const emergencyQueueCount = emergencyPatients.filter(p => p.status === "in progress").length
  const availableBeds = beds.filter(b => b.status === "Available").length
  const totalBeds = beds.length

  // Medical Tests state
  const [tests, setTests] = useState<MedicalTest[]>(initialTests)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<MedicalTest | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)

  // Test form state
  const [testForm, setTestForm] = useState({
    testType: "",
    testName: "",
    description: "",
    timeAvailable: "",
    cost: "",
    preparationInstructions: "",
  })

  // Patient lists state
  const [pendingPatients, setPendingPatients] = useState<PendingPatient[]>(initialPendingPatients)
  const [completedPatients, setCompletedPatients] = useState<CompletedPatient[]>(initialCompletedPatients)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadingPatientId, setUploadingPatientId] = useState<string | null>(null)

  // Emergency Queue handlers
  const handleAddEmergencyPatient = () => {
    if (!emergencyPatientName.trim()) return

    const newPatient: EmergencyPatient = {
      id: Date.now().toString(),
      patientName: emergencyPatientName.trim(),
      ticketNumber: `EM-${String(ticketCounter).padStart(3, "0")}`,
      status: "in progress",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setEmergencyPatients([...emergencyPatients, newPatient])
    setTicketCounter(ticketCounter + 1)
    setEmergencyPatientName("")
    setEmergencyDialogOpen(false)
  }

  const handleMarkEmergencyCompleted = (patientId: string) => {
    setEmergencyPatients(
      emergencyPatients.filter(p => p.id !== patientId)
    )
  }

  // Bed Management handlers
  const handleAddBed = () => {
    if (!bedForm.bedNumber.trim()) return

    const newBed: HospitalBed = {
      id: Date.now().toString(),
      bedNumber: bedForm.bedNumber.trim(),
      bedType: bedForm.bedType,
      status: "Available",
      assignedPatient: null,
    }

    setBeds([...beds, newBed])
    setBedForm({ bedNumber: "", bedType: "Ward" })
    setBedDialogOpen(false)
  }

  const openAssignPatientDialog = (bedId: string) => {
    setAssigningBedId(bedId)
    setAssignPatientName("")
    setAssignPatientDialogOpen(true)
  }

  const handleAssignPatient = () => {
    if (!assigningBedId || !assignPatientName.trim()) return

    setBeds(
      beds.map(b =>
        b.id === assigningBedId
          ? { ...b, status: "Occupied" as const, assignedPatient: assignPatientName.trim() }
          : b
      )
    )
    setAssignPatientName("")
    setAssigningBedId(null)
    setAssignPatientDialogOpen(false)
  }

  const handleMarkBedAvailable = (bedId: string) => {
    setBeds(
      beds.map(b =>
        b.id === bedId
          ? { ...b, status: "Available" as const, assignedPatient: null }
          : b
      )
    )
  }

  // Test CRUD handlers
  const openAddTestDialog = () => {
    setEditingTest(null)
    setTestForm({
      testType: "",
      testName: "",
      description: "",
      timeAvailable: "",
      cost: "",
      preparationInstructions: "",
    })
    setTestDialogOpen(true)
  }

  const openEditTestDialog = (test: MedicalTest) => {
    setEditingTest(test)
    setTestForm({
      testType: test.testType,
      testName: test.testName,
      description: test.description,
      timeAvailable: test.timeAvailable,
      cost: test.cost,
      preparationInstructions: test.preparationInstructions,
    })
    setTestDialogOpen(true)
  }

  const handleSaveTest = () => {
    if (editingTest) {
      setTests(
        tests.map((t) =>
          t.id === editingTest.id ? { ...t, ...testForm } : t
        )
      )
    } else {
      const newTest: MedicalTest = {
        id: Date.now().toString(),
        ...testForm,
      }
      setTests([...tests, newTest])
    }
    setTestDialogOpen(false)
  }

  const openDeleteDialog = (id: string) => {
    setTestToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteTest = () => {
    if (testToDelete) {
      setTests(tests.filter((t) => t.id !== testToDelete))
      setTestToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  // Patient upload handlers
  const openUploadDialog = (patientId: string) => {
    setUploadingPatientId(patientId)
    setUploadDialogOpen(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadingPatientId || !e.target.files) return

    const files = Array.from(e.target.files)
    const newFiles: ReportFile[] = files.map((f) => ({
      name: f.name,
      uploadedAt: new Date().toISOString().split("T")[0],
    }))

    setPendingPatients(
      pendingPatients.map((p) =>
        p.id === uploadingPatientId
          ? { ...p, uploadedFiles: [...p.uploadedFiles, ...newFiles] }
          : p
      )
    )
    setUploadDialogOpen(false)
  }

  const handleMarkAsCompleted = (patientId: string) => {
    const patient = pendingPatients.find((p) => p.id === patientId)
    if (!patient || patient.uploadedFiles.length === 0) return

    const completedPatient: CompletedPatient = {
      id: patient.id,
      patientName: patient.patientName,
      testName: patient.testName,
      dateCompleted: new Date().toISOString().split("T")[0],
      reportFiles: patient.uploadedFiles,
    }

    setPendingPatients(pendingPatients.filter((p) => p.id !== patientId))
    setCompletedPatients([completedPatient, ...completedPatients])
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:block">
        <SidebarContent activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent activeTab={activeTab} onTabChange={(tab) => {
            setActiveTab(tab)
            setMobileOpen(false)
          }} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Hospital Dashboard</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
              
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      Patients in progress
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Bed Availability
                    </CardTitle>
                    <Bed className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {availableBeds}{" "}
                      <span className="text-lg font-normal text-muted-foreground">
                        / {totalBeds}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available beds
                    </p>
                  </CardContent>
                </Card>

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

              {/* Emergency Queue Management */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Emergency Queue</CardTitle>
                    <CardDescription>Manage emergency patients currently in progress</CardDescription>
                  </div>
                  <Button onClick={() => setEmergencyDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Emergency Patient
                  </Button>
                </CardHeader>
                <CardContent>
                  {emergencyPatients.filter(p => p.status === "in progress").length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No emergency patients in queue
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Ticket No.</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emergencyPatients
                          .filter(p => p.status === "in progress")
                          .map((patient) => (
                            <TableRow key={patient.id}>
                              <TableCell className="font-medium">{patient.patientName}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{patient.ticketNumber}</Badge>
                              </TableCell>
                              <TableCell>{patient.createdAt}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkEmergencyCompleted(patient.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Completed
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Bed Management */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Bed Management</CardTitle>
                    <CardDescription>Manage hospital beds and patient assignments</CardDescription>
                  </div>
                  <Button onClick={() => setBedDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bed
                  </Button>
                </CardHeader>
                <CardContent>
                  {beds.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No beds added yet
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bed No.</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assigned Patient</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {beds.map((bed) => (
                          <TableRow key={bed.id}>
                            <TableCell className="font-medium">{bed.bedNumber}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{bed.bedType}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={bed.status === "Available" ? "default" : "secondary"}
                                className={bed.status === "Available" ? "bg-green-600 hover:bg-green-700" : ""}
                              >
                                {bed.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {bed.assignedPatient || <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              {bed.status === "Available" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openAssignPatientDialog(bed.id)}
                                >
                                  Assign Patient
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkBedAvailable(bed.id)}
                                >
                                  Mark as Available
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Medical Tests</h1>
                <Button onClick={openAddTestDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Test
                </Button>
              </div>

              {/* Tests Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Test List</CardTitle>
                  <CardDescription>
                    Manage medical tests provided by your hospital
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Time Available</TableHead>
                        <TableHead>Cost (BDT)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">
                            {test.testName}
                          </TableCell>
                          <TableCell>{test.testType}</TableCell>
                          <TableCell>{test.timeAvailable}</TableCell>
                          <TableCell>{test.cost}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditTestDialog(test)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(test.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Patient Lists */}
              <Tabs defaultValue="pending" className="w-full">
                <TabsList>
                  <TabsTrigger value="pending">
                    Pending Patients ({pendingPatients.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed Patients ({completedPatients.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Patients</CardTitle>
                      <CardDescription>
                        Patients who booked a test but do not have a report yet
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pendingPatients.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No pending patients
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Test Name</TableHead>
                              <TableHead>Date Booked</TableHead>
                              <TableHead>Uploaded Files</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingPatients.map((patient) => (
                              <TableRow key={patient.id}>
                                <TableCell className="font-medium">
                                  {patient.patientName}
                                </TableCell>
                                <TableCell>{patient.testName}</TableCell>
                                <TableCell>{patient.dateBooked}</TableCell>
                                <TableCell>
                                  {patient.uploadedFiles.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                      {patient.uploadedFiles.map((file, idx) => (
                                        <span
                                          key={idx}
                                          className="text-xs text-muted-foreground flex items-center gap-1"
                                        >
                                          <FileText className="h-3 w-3" />
                                          {file.name}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      No files
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openUploadDialog(patient.id)}
                                    >
                                      <Upload className="mr-2 h-4 w-4" />
                                      Upload Report
                                    </Button>
                                    {patient.uploadedFiles.length > 0 && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleMarkAsCompleted(patient.id)}
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as Completed
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Patients</CardTitle>
                      <CardDescription>
                        Patients who already have their test results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {completedPatients.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No completed patients
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Test Name</TableHead>
                              <TableHead>Date Completed</TableHead>
                              <TableHead>Report Files</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {completedPatients.map((patient) => (
                              <TableRow key={patient.id}>
                                <TableCell className="font-medium">
                                  {patient.patientName}
                                </TableCell>
                                <TableCell>{patient.testName}</TableCell>
                                <TableCell>{patient.dateCompleted}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    {patient.reportFiles.map((file, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs text-muted-foreground flex items-center gap-1"
                                      >
                                        <FileText className="h-3 w-3" />
                                        {file.name}
                                      </span>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Hospital Settings</CardTitle>
                  <CardDescription>
                    Configure your hospital preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Settings panel coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Add Emergency Patient Dialog */}
      <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Patient</DialogTitle>
            <DialogDescription>
              Issue a ticket for a new emergency patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyPatientName">Patient Name</Label>
              <Input
                id="emergencyPatientName"
                placeholder="Enter patient name"
                value={emergencyPatientName}
                onChange={(e) => setEmergencyPatientName(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Ticket will be assigned: <Badge variant="secondary">EM-{String(ticketCounter).padStart(3, "0")}</Badge>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmergencyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmergencyPatient}>
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bed Dialog */}
      <Dialog open={bedDialogOpen} onOpenChange={setBedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
            <DialogDescription>
              Add a new bed to the hospital
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bedNumber">Bed Number</Label>
              <Input
                id="bedNumber"
                placeholder="e.g., W-101"
                value={bedForm.bedNumber}
                onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedType">Bed Type</Label>
              <Select
                value={bedForm.bedType}
                onValueChange={(value: "Ward" | "Cabin" | "ICU") =>
                  setBedForm({ ...bedForm, bedType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bed type" />
                </SelectTrigger>
                <SelectContent>
                  {bedTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBedDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBed}>
              Add Bed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Patient Dialog */}
      <Dialog open={assignPatientDialogOpen} onOpenChange={setAssignPatientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Patient to Bed</DialogTitle>
            <DialogDescription>
              Enter the patient name to assign to this bed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assignPatientName">Patient Name</Label>
              <Input
                id="assignPatientName"
                placeholder="Enter patient name"
                value={assignPatientName}
                onChange={(e) => setAssignPatientName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignPatientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPatient}>
              Assign Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Create/Edit Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTest ? "Edit Medical Test" : "Add New Medical Test"}
            </DialogTitle>
            <DialogDescription>
              {editingTest
                ? "Update the details of this medical test"
                : "Fill in the details for the new medical test"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                <Select
                  value={testForm.testType}
                  onValueChange={(value) =>
                    setTestForm({ ...testForm, testType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  placeholder="e.g., Complete Blood Count"
                  value={testForm.testName}
                  onChange={(e) =>
                    setTestForm({ ...testForm, testName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this test measures..."
                value={testForm.description}
                onChange={(e) =>
                  setTestForm({ ...testForm, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeAvailable">Time Available</Label>
                <Input
                  id="timeAvailable"
                  placeholder="e.g., Sunday to Thursday 10AM–2PM"
                  value={testForm.timeAvailable}
                  onChange={(e) =>
                    setTestForm({ ...testForm, timeAvailable: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (BDT)</Label>
                <Input
                  id="cost"
                  placeholder="e.g., 500"
                  value={testForm.cost}
                  onChange={(e) =>
                    setTestForm({ ...testForm, cost: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preparationInstructions">
                Preparation Instructions
              </Label>
              <Textarea
                id="preparationInstructions"
                placeholder="Any special instructions for patients..."
                value={testForm.preparationInstructions}
                onChange={(e) =>
                  setTestForm({
                    ...testForm,
                    preparationInstructions: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTest}>
              {editingTest ? "Save Changes" : "Add Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Test Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medical Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medical test? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Report Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Report</DialogTitle>
            <DialogDescription>
              Upload one or more report files for this patient
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
