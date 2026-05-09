"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, AlertCircle } from "lucide-react"

export default function NurseLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loginError, setLoginError] = useState("")

  // Demo credentials
  const DEMO_EMAIL = "nurse@example.com"
  const DEMO_PASSWORD = "123456"

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLoginError("")
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Mock validation with demo credentials
    if (formData.email === DEMO_EMAIL && formData.password === DEMO_PASSWORD) {
      localStorage.setItem("medihub_nurse_logged_in", "true")
      router.push("/nurse/dashboard")
    } else {
      setLoginError("Invalid email or password. Try the demo credentials.")
    }
  }

  const handleDemoLogin = () => {
    setFormData({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
    localStorage.setItem("medihub_nurse_logged_in", "true")
    router.push("/nurse/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Login Form Card */}
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
            <CardTitle className="text-2xl">Nurse Login</CardTitle>
            <CardDescription>
              Sign in to access your nurse dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link href="/nurse/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Demo Login Card */}
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Demo Login</CardTitle>
            <CardDescription>
              Quick access to nurse dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{DEMO_EMAIL}</code>
              </p>
              <p>
                <span className="text-muted-foreground">Password:</span>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{DEMO_PASSWORD}</code>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
            >
              <Heart className="mr-2 h-4 w-4" />
              Login as Demo Nurse
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
