"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HospitalLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/hospital/dashboard")
  }

  const handleDemoLogin = () => {
    setFormData({
      email: "hospital@example.com",
      password: "123456",
    })
    router.push("/hospital/dashboard")
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
            <CardTitle className="text-2xl">Hospital Login</CardTitle>
            <CardDescription>
              Sign in to access your hospital dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link href="/hospital/register" className="text-primary hover:underline">
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
              Use demo credentials to explore the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">hospital@example.com</code>
              </p>
              <p>
                <span className="text-muted-foreground">Password:</span>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">123456</code>
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleDemoLogin}
            >
              Login with Demo Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
