"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserCheck, GraduationCap, Eye, EyeOff, ArrowLeft, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState(searchParams.get("role") || "recruiter")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: role === "recruiter" ? "recruiter" : "faculty",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store session data
        localStorage.setItem("session_token", data.session_token)
        localStorage.setItem("user_role", data.user.role)
        localStorage.setItem("user_name", data.user.full_name)
        localStorage.setItem("user_id", data.user.id)

        // Redirect based on role
        if (data.user.role === "recruiter") {
          router.push("/dashboard/recruiter")
        } else if (data.user.role === "faculty") {
          router.push("/dashboard/faculty")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRoleConfig = () => {
    if (role === "recruiter") {
      return {
        icon: <UserCheck className="h-8 w-8 text-blue-600" />,
        title: "Admin Login",
        description: "Access the recruitment management dashboard",
        color: "text-blue-600",
        gradient: "from-blue-500 to-blue-600",
        demoEmail: "admin@university.edu",
      }
    } else {
      return {
        icon: <GraduationCap className="h-8 w-8 text-green-600" />,
        title: "Faculty Login",
        description: "Access your interview assignments and evaluations",
        color: "text-green-600",
        gradient: "from-green-500 to-green-600",
        demoEmail: "sarah.smith@university.edu",
      }
    }
  }

  const config = getRoleConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RecruitPro</h1>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${config.gradient} rounded-2xl flex items-center justify-center`}
              >
                {config.icon}
              </div>
            </div>
            <CardTitle className={`text-2xl ${config.color}`}>{config.title}</CardTitle>
            <CardDescription className="text-gray-600">{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-12 bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white font-medium`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Need to login as{" "}
                {role === "recruiter" ? (
                  <Link href="/auth/login?role=faculty" className="text-green-600 hover:text-green-800 font-medium">
                    Faculty Member
                  </Link>
                ) : (
                  <Link href="/auth/login?role=recruiter" className="text-blue-600 hover:text-blue-800 font-medium">
                    Admin
                  </Link>
                )}
                ?
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-600">{config.demoEmail}</p>
                <p className="font-mono text-xs text-gray-600">password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
