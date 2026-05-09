"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, User, Briefcase, FileCheck, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const DEPARTMENTS = [
  { id: "icu", label: "ICU" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "general", label: "General" },
  { id: "emergency", label: "Emergency" },
  { id: "surgery", label: "Surgery" },
  { id: "maternity", label: "Maternity" },
  { id: "cardiology", label: "Cardiology" },
  { id: "oncology", label: "Oncology" },
  { id: "orthopedics", label: "Orthopedics" },
  { id: "neurology", label: "Neurology" },
  { id: "opd", label: "OPD" },
  { id: "homecare", label: "Home Care" },
  { id: "other", label: "Other" },
]

export default function NurseRegistrationPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    // Professional Information
    nursingRegNumber: "",
    departments: [] as string[],
    otherDepartment: "",
    yearsOfExperience: "",
    experienceTimeline: "",
    affiliatedHospital: "",
    // Account Information
    password: "",
    confirmPassword: "",
  })

  const [files, setFiles] = useState({
    governmentId: null as File | null,
    nursingLicense: null as File | null,
    degreeCertificates: null as File | null,
    recentPhotograph: null as File | null,
    hospitalIdCard: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      departments: checked
        ? [...prev.departments, departmentId]
        : prev.departments.filter((d) => d !== departmentId),
    }))
    if (errors.departments) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.departments
        return newErrors
      })
    }
  }

  const handleFileChange = (name: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.nursingRegNumber.trim()) newErrors.nursingRegNumber = "Nursing registration number is required"
    if (formData.departments.length === 0) newErrors.departments = "Select at least one department"
    if (formData.departments.includes("other") && !formData.otherDepartment.trim()) {
      newErrors.otherDepartment = "Please specify the other department"
    }
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required"
    if (!formData.experienceTimeline.trim()) newErrors.experienceTimeline = "Experience timeline is required"

    // Required files
    if (!files.governmentId) newErrors.governmentId = "Government ID is required"
    if (!files.nursingLicense) newErrors.nursingLicense = "Nursing license certificate is required"
    if (!files.degreeCertificates) newErrors.degreeCertificates = "Degree/Diploma certificates are required"
    if (!files.recentPhotograph) newErrors.recentPhotograph = "Recent photograph is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Mock registration - redirect to login
      router.push("/nurse/login")
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
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
            <CardTitle className="text-2xl">Nurse Registration</CardTitle>
            <CardDescription>
              Register as a nursing professional on MediHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={errors.dateOfBirth ? "border-destructive" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-xs text-destructive">{errors.gender}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      placeholder="+880 1XXXXXXXXX"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={errors.contactNumber ? "border-destructive" : ""}
                    />
                    {errors.contactNumber && (
                      <p className="text-xs text-destructive">{errors.contactNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nurse@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={errors.confirmPassword ? "border-destructive" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Professional Information</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="nursingRegNumber">Nursing Registration Number *</Label>
                    <Input
                      id="nursingRegNumber"
                      name="nursingRegNumber"
                      placeholder="Enter your nursing registration number"
                      value={formData.nursingRegNumber}
                      onChange={handleInputChange}
                      className={errors.nursingRegNumber ? "border-destructive" : ""}
                    />
                    {errors.nursingRegNumber && (
                      <p className="text-xs text-destructive">{errors.nursingRegNumber}</p>
                    )}
                  </div>

                  <div className="space-y-3 sm:col-span-2">
                    <Label>Department/Specialization *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {DEPARTMENTS.map((dept) => (
                        <div key={dept.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={dept.id}
                            checked={formData.departments.includes(dept.id)}
                            onCheckedChange={(checked) =>
                              handleDepartmentChange(dept.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={dept.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {dept.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.departments && (
                      <p className="text-xs text-destructive">{errors.departments}</p>
                    )}

                    {formData.departments.includes("other") && (
                      <div className="space-y-2 mt-2">
                        <Label htmlFor="otherDepartment">Specify Other Department *</Label>
                        <Input
                          id="otherDepartment"
                          name="otherDepartment"
                          placeholder="Enter department name"
                          value={formData.otherDepartment}
                          onChange={handleInputChange}
                          className={errors.otherDepartment ? "border-destructive" : ""}
                        />
                        {errors.otherDepartment && (
                          <p className="text-xs text-destructive">{errors.otherDepartment}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className={errors.yearsOfExperience ? "border-destructive" : ""}
                    />
                    {errors.yearsOfExperience && (
                      <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliatedHospital">Affiliated Hospital/Clinic (Optional)</Label>
                    <Input
                      id="affiliatedHospital"
                      name="affiliatedHospital"
                      placeholder="Hospital/Clinic name"
                      value={formData.affiliatedHospital}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="experienceTimeline">Years of Experience Timeline *</Label>
                    <Textarea
                      id="experienceTimeline"
                      name="experienceTimeline"
                      placeholder="e.g., 2018-2020: ICU Nurse at City Hospital&#10;2020-2023: Emergency Nurse at General Hospital"
                      value={formData.experienceTimeline}
                      onChange={handleInputChange}
                      rows={4}
                      className={errors.experienceTimeline ? "border-destructive" : ""}
                    />
                    {errors.experienceTimeline && (
                      <p className="text-xs text-destructive">{errors.experienceTimeline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Documents Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Verification Documents</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Government ID *</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="governmentId"
                      onChange={(e) => handleFileChange("governmentId", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start ${errors.governmentId ? "border-destructive" : ""}`}
                      onClick={() => document.getElementById("governmentId")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.governmentId ? files.governmentId.name : "Upload Government ID"}
                    </Button>
                    {errors.governmentId && (
                      <p className="text-xs text-destructive">{errors.governmentId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Nursing License Certificate *</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="nursingLicense"
                      onChange={(e) => handleFileChange("nursingLicense", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start ${errors.nursingLicense ? "border-destructive" : ""}`}
                      onClick={() => document.getElementById("nursingLicense")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.nursingLicense ? files.nursingLicense.name : "Upload Nursing License"}
                    </Button>
                    {errors.nursingLicense && (
                      <p className="text-xs text-destructive">{errors.nursingLicense}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Degree/Diploma Certificates *</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="degreeCertificates"
                      onChange={(e) => handleFileChange("degreeCertificates", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start ${errors.degreeCertificates ? "border-destructive" : ""}`}
                      onClick={() => document.getElementById("degreeCertificates")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.degreeCertificates ? files.degreeCertificates.name : "Upload Certificates"}
                    </Button>
                    {errors.degreeCertificates && (
                      <p className="text-xs text-destructive">{errors.degreeCertificates}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Recent Photograph *</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      id="recentPhotograph"
                      onChange={(e) => handleFileChange("recentPhotograph", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start ${errors.recentPhotograph ? "border-destructive" : ""}`}
                      onClick={() => document.getElementById("recentPhotograph")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.recentPhotograph ? files.recentPhotograph.name : "Upload Photograph"}
                    </Button>
                    {errors.recentPhotograph && (
                      <p className="text-xs text-destructive">{errors.recentPhotograph}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Hospital/Clinic ID Card (Optional)</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="hospitalIdCard"
                      onChange={(e) => handleFileChange("hospitalIdCard", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => document.getElementById("hospitalIdCard")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.hospitalIdCard ? files.hospitalIdCard.name : "Upload Hospital ID Card"}
                    </Button>
                  </div>
                </div>
              </div>

              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fix the errors above before submitting.
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg">
                Register as Nurse
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <Link href="/nurse/login" className="text-primary hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
