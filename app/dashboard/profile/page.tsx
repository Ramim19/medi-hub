"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  User,
  FileText,
  AlertTriangle,
  Calendar,
  Download,
  Edit,
  Shield,
  Droplet,
  Phone,
  Mail,
  MapPin,
  Users,
  Plus,
  Trash2,
} from "lucide-react"

const patientData = {
  name: "John Doe",
  age: 35,
  gender: "Male",
  bloodType: "O+",
  phone: "+880 1712-345678",
  email: "john.doe@email.com",
  address: "123 Green Road, Dhaka 1205",
  emergencyContact: {
    name: "Jane Doe",
    relation: "Spouse",
    phone: "+880 1798-765432",
  },
  insuranceId: "INS-2024-78901",
  medihubId: "MH-2024-001234",
}

const allergies = [
  { name: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
  { name: "Shellfish", severity: "moderate", reaction: "Hives, swelling" },
  { name: "Dust mites", severity: "mild", reaction: "Sneezing, congestion" },
]

const medicalHistory = [
  {
    date: "Apr 15, 2026",
    type: "Consultation",
    provider: "Dr. Sarah Ahmed",
    hospital: "Square Hospital",
    notes: "Routine diabetes checkup. HbA1c levels stable at 6.8%.",
  },
  {
    date: "Mar 28, 2026",
    type: "Lab Test",
    provider: "Labaid Diagnostics",
    hospital: "Labaid Hospital",
    notes: "Complete blood count, lipid profile. All values within normal range.",
  },
  {
    date: "Feb 10, 2026",
    type: "Emergency Visit",
    provider: "Dr. Karim",
    hospital: "United Hospital",
    notes: "Acute gastritis. Treated and discharged same day.",
  },
  {
    date: "Jan 5, 2026",
    type: "Consultation",
    provider: "Dr. Sarah Ahmed",
    hospital: "Square Hospital",
    notes: "Annual physical examination. Blood pressure well controlled.",
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Daily Glucose Monitoring",
      content: "Keep track of fasting blood glucose levels. Target is below 100 mg/dL. Report if it exceeds 130 mg/dL consistently.",
      date: "May 10, 2026",
      category: "General",
      author: "Dr. Sarah Ahmed",
    },
    {
      id: 2,
      title: "Gastritis Flare-up Precautions",
      content: "Avoid spicy and greasy foods for the next two weeks. Take Metformin with meals to reduce abdominal discomfort.",
      date: "Feb 12, 2026",
      category: "Dietary",
      author: "Dr. Karim",
    },
    {
      id: 3,
      title: "Exercise Routine Recommendation",
      content: "Engage in moderate-intensity aerobic exercise (e.g., brisk walking) for at least 30 minutes daily, 5 days a week.",
      date: "Jan 6, 2026",
      category: "Lifestyle",
      author: "Dr. Sarah Ahmed",
    },
  ])

  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteCategory, setNewNoteCategory] = useState("General")

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return

    const newNote = {
      id: Date.now(),
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: newNoteCategory,
      author: "John Doe (Patient)",
    }

    setNotes([newNote, ...notes])
    setNewNoteTitle("")
    setNewNoteContent("")
    setNewNoteCategory("General")
  }

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "general":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "dietary":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "lifestyle":
        return "bg-green-50 text-green-700 border-green-200"
      case "prescription":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
            <AvatarImage src="/placeholder-avatar.jpg" alt={patientData.name} />
            <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{patientData.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
              <span>{patientData.age} years old</span>
              <span>·</span>
              <span>{patientData.gender}</span>
              <span>·</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                <Droplet className="mr-1 h-3 w-3" />
                {patientData.bloodType}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              MediHub ID: <span className="font-mono font-semibold">{patientData.medihubId}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Security Badge */}
      <Card className="border-secondary/30 bg-secondary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <Shield className="h-6 w-6 text-secondary" />
          <div>
            <p className="font-semibold text-secondary">Your Medical Records Are Secure</p>
            <p className="text-sm text-muted-foreground">
              All data is encrypted with 256-bit SSL and compliant with HIPAA standards.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patientData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{patientData.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{patientData.address}</span>
              </div>
              <Separator />
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Emergency Contact</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-destructive" />
                  <span className="font-medium">{patientData.emergencyContact.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {patientData.emergencyContact.relation}
                  </Badge>
                </div>
                <p className="mt-1 text-sm">{patientData.emergencyContact.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Allergies & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-4 ${
                      allergy.severity === "severe"
                        ? "border-red-200 bg-red-50"
                        : allergy.severity === "moderate"
                        ? "border-amber-200 bg-amber-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{allergy.name}</span>
                      <Badge
                        variant={
                          allergy.severity === "severe"
                            ? "destructive"
                            : allergy.severity === "moderate"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          allergy.severity === "moderate"
                            ? "bg-amber-500"
                            : allergy.severity === "mild"
                            ? "bg-gray-500"
                            : ""
                        }
                      >
                        {allergy.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{allergy.reaction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-chart-3" />
                Medical History
              </CardTitle>
              <CardDescription>Your past visits, consultations, and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {medicalHistory.map((record, index) => (
                    <div key={index} className="relative border-l-2 border-border pl-6 pb-6">
                      <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary" />
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {record.type}
                            </Badge>
                            <h4 className="font-semibold">{record.provider}</h4>
                            <p className="text-sm text-muted-foreground">{record.hospital}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {record.date}
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{record.notes}</p>
                        <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                          View Full Record
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Create New Note Form */}
            <div className="lg:col-span-1">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Edit className="h-5 w-5 text-primary" />
                    Create New Note
                  </CardTitle>
                  <CardDescription>Add a personal health note or general reminder.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-title">Title</Label>
                      <Input
                        id="note-title"
                        placeholder="e.g. Morning Cardio Plan"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["General", "Dietary", "Lifestyle", "Prescription"].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewNoteCategory(cat)}
                            className={`flex items-center justify-center rounded-lg border py-2 text-xs font-medium transition-all duration-200 ${
                              newNoteCategory === cat
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-card text-muted-foreground border-border hover:bg-muted/50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note-content">Content</Label>
                      <Textarea
                        id="note-content"
                        placeholder="Write note details here..."
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        required
                        className="min-h-[120px] bg-background resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full transition-transform active:scale-95">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* List of Notes */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-secondary" />
                    Personal & Medical Notes
                  </CardTitle>
                  <CardDescription>Keep track of your recommendations, daily logs, and advice.</CardDescription>
                </CardHeader>
                <CardContent>
                  {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mb-4 stroke-[1.5]" />
                      <h3 className="font-semibold text-foreground">No notes recorded</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
                        Add your first note on the left to start tracking your updates.
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[520px] pr-4">
                      <div className="space-y-4">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <h4 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                                  {note.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getCategoryBadgeClass(
                                    note.category
                                  )}`}
                                >
                                  {note.category}
                                </Badge>
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {note.content}
                              </p>
                            </div>
                            
                            <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
                              <div className="flex flex-wrap items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {note.date}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium text-foreground/75">
                                  <User className="h-3.5 w-3.5" />
                                  By {note.author}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteNote(note.id)}
                                className="h-8 w-8 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
