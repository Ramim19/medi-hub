"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MapPin } from "lucide-react"

export default function HospitalRegistrationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    hospitalName: "",
    licenseNumber: "",
    address: "",
    licenseDocument: null as File | null,
    email: "",
    password: "",
  })
  const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, licenseDocument: file }))
  }

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPinPosition({ x, y })
  }

  const handlePinDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setPinPosition({ x, y })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/hospital/login")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <Image
              src="/images/medihub-header.png"
              alt="MediHub"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <CardTitle className="text-2xl">Hospital Registration</CardTitle>
          <CardDescription>
            Register your hospital to join the MediHub network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                name="hospitalName"
                type="text"
                placeholder="Enter hospital name"
                value={formData.hospitalName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                placeholder="Enter license number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter hospital address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseDocument">Upload License Document</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="licenseDocument"
                  name="licenseDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("licenseDocument")?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {formData.licenseDocument ? formData.licenseDocument.name : "Choose File"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hospital Location (Click or drag pin on map)</Label>
              <div
                className="relative w-full h-64 rounded-lg border border-border overflow-hidden cursor-crosshair bg-muted"
                onClick={handleMapClick}
                onMouseMove={handlePinDrag}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                {/* Static Dhaka Map Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10">
                  <svg
                    viewBox="0 0 400 300"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    {/* Grid lines for map effect */}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 40}
                        y1="0"
                        x2={i * 40}
                        y2="300"
                        stroke="currentColor"
                        strokeOpacity="0.1"
                      />
                    ))}
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 40}
                        x2="400"
                        y2={i * 40}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                      />
                    ))}
                    {/* Simplified Dhaka landmarks */}
                    <circle cx="200" cy="150" r="60" fill="currentColor" fillOpacity="0.05" />
                    <circle cx="200" cy="150" r="30" fill="currentColor" fillOpacity="0.08" />
                    <text x="200" y="155" textAnchor="middle" className="text-xs fill-muted-foreground">
                      Dhaka
                    </text>
                    <text x="120" y="100" textAnchor="middle" className="text-[10px] fill-muted-foreground">
                      Mirpur
                    </text>
                    <text x="280" y="100" textAnchor="middle" className="text-[10px] fill-muted-foreground">
                      Gulshan
                    </text>
                    <text x="150" y="220" textAnchor="middle" className="text-[10px] fill-muted-foreground">
                      Dhanmondi
                    </text>
                    <text x="260" y="220" textAnchor="middle" className="text-[10px] fill-muted-foreground">
                      Motijheel
                    </text>
                  </svg>
                </div>
                {/* Draggable Pin */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing"
                  style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
                  onMouseDown={() => setIsDragging(true)}
                >
                  <MapPin className="h-8 w-8 text-destructive drop-shadow-lg" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Click on the map or drag the pin to set your hospital location
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hospital@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Register Hospital
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link href="/hospital/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
