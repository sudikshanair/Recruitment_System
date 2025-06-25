"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  X,
  Plus,
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  User,
  Briefcase,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AddFacultyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([])
  const [newExpertise, setNewExpertise] = useState("")
  const [researchInterests, setResearchInterests] = useState<string[]>([])
  const [newResearch, setNewResearch] = useState("")
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [interviewTypes, setInterviewTypes] = useState<string[]>(["technical"])
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    employee_id: "",
    department: "",
    designation: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    max_interviews_per_day: "3",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("") // Clear error when user starts typing
  }

  const addExpertise = () => {
    if (newExpertise.trim() && !expertiseAreas.includes(newExpertise.trim())) {
      setExpertiseAreas([...expertiseAreas, newExpertise.trim()])
      setNewExpertise("")
    }
  }

  const removeExpertise = (expertiseToRemove: string) => {
    setExpertiseAreas(expertiseAreas.filter((expertise) => expertise !== expertiseToRemove))
  }

  const addResearch = () => {
    if (newResearch.trim() && !researchInterests.includes(newResearch.trim())) {
      setResearchInterests([...researchInterests, newResearch.trim()])
      setNewResearch("")
    }
  }

  const removeResearch = (researchToRemove: string) => {
    setResearchInterests(researchInterests.filter((research) => research !== researchToRemove))
  }

  const addTimeSlot = (slot: string) => {
    if (!timeSlots.includes(slot)) {
      setTimeSlots([...timeSlots, slot])
    }
  }

  const removeTimeSlot = (slotToRemove: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot !== slotToRemove))
  }

  const toggleInterviewType = (type: string) => {
    if (interviewTypes.includes(type)) {
      setInterviewTypes(interviewTypes.filter((t) => t !== type))
    } else {
      setInterviewTypes([...interviewTypes, type])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // 1️⃣  basic client-side validation
    if (!formData.full_name || !formData.email || !formData.department) {
      setError("Please fill in all required fields (Name, Email, Department)")
      setLoading(false)
      return
    }
    if (expertiseAreas.length === 0) {
      setError("Please add at least one expertise area")
      setLoading(false)
      return
    }

    // 2️⃣  build payload
    const payload = {
      ...formData,
      experience_years: formData.experience_years || "0",
      max_interviews_per_day: formData.max_interviews_per_day || "3",
      expertise_areas: expertiseAreas,
      research_interests: researchInterests,
      preferred_time_slots: timeSlots,
      interview_types: interviewTypes,
    }

    try {
      const response = await fetch("/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      // 3️⃣  Safely parse: JSON when possible, plain text otherwise
      const isJson = response.headers.get("content-type")?.includes("application/json")
      const data = isJson ? await response.json() : { error: await response.text() }

      if (!response.ok) {
        setError(data.error || "Server error – please try again.")
        return
      }

      if (data.success) {
        setSuccess(true)
        setTimeout(() => router.push("/dashboard/recruiter"), 1800)
      } else {
        setError(data.error || "Unexpected response from server.")
      }
    } catch (err) {
      console.error("Network / parsing error:", err)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <Card className="relative max-w-md w-full shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Faculty Added Successfully!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The faculty member has been successfully added to the system and is now available for interview
              assignments.
            </p>
            <Button
              onClick={() => router.push("/dashboard/recruiter")}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/recruiter" className="text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Add New Faculty
                </h1>
                <p className="text-gray-600">Create a comprehensive faculty profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-7 w-7" />
                </div>
                Faculty Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              {error && (
                <Alert className="mb-8 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Information Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="full_name" className="text-gray-800 font-semibold text-lg">
                        Full Name *
                      </Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        placeholder="Dr. John Smith"
                        className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-800 font-semibold text-lg">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john.smith@university.edu"
                        className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-gray-800 font-semibold text-lg">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1-555-0123"
                        className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="employee_id" className="text-gray-800 font-semibold text-lg">
                        Employee ID
                      </Label>
                      <Input
                        id="employee_id"
                        value={formData.employee_id}
                        onChange={(e) => handleInputChange("employee_id", e.target.value)}
                        placeholder="FAC001"
                        className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Professional Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="department" className="text-gray-800 font-semibold text-lg">
                        Department *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("department", value)}>
                        <SelectTrigger className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="designation" className="text-gray-800 font-semibold text-lg">
                        Designation
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("designation", value)}>
                        <SelectTrigger className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50">
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                          <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                          <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
                          <SelectItem value="Lecturer">Lecturer</SelectItem>
                          <SelectItem value="Visiting Faculty">Visiting Faculty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="specialization" className="text-gray-800 font-semibold text-lg">
                        Specialization
                      </Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        placeholder="e.g., Artificial Intelligence, Web Development"
                        className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="experience_years" className="text-gray-800 font-semibold text-lg">
                        Years of Experience
                      </Label>
                      <Input
                        id="experience_years"
                        type="number"
                        min="0"
                        value={formData.experience_years}
                        onChange={(e) => handleInputChange("experience_years", e.target.value)}
                        placeholder="10"
                        className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="qualification" className="text-gray-800 font-semibold text-lg">
                      Qualification
                    </Label>
                    <Textarea
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange("qualification", e.target.value)}
                      placeholder="Ph.D. in Computer Science, M.Tech in Software Engineering"
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50 text-lg"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Expertise Areas */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Expertise Areas *</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Input
                        placeholder="Add expertise area (e.g., React, Machine Learning, Data Structures)"
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
                        className="flex-1 h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                      />
                      <Button
                        type="button"
                        onClick={addExpertise}
                        className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {expertiseAreas.map((expertise, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 hover:from-emerald-200 hover:to-green-200 transition-colors"
                        >
                          {expertise}
                          <X
                            className="h-4 w-4 cursor-pointer hover:text-red-600 transition-colors"
                            onClick={() => removeExpertise(expertise)}
                          />
                        </Badge>
                      ))}
                    </div>

                    {expertiseAreas.length === 0 && (
                      <Alert className="border-amber-200 bg-amber-50">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          Please add at least one expertise area for the faculty member.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                {/* Research Interests */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Research Interests</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Input
                        placeholder="Add research interest (e.g., Machine Learning, Cloud Computing)"
                        value={newResearch}
                        onChange={(e) => setNewResearch(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addResearch())}
                        className="flex-1 h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                      />
                      <Button
                        type="button"
                        onClick={addResearch}
                        className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {researchInterests.map((research, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border border-cyan-200 hover:from-cyan-200 hover:to-blue-200 transition-colors"
                        >
                          {research}
                          <X
                            className="h-4 w-4 cursor-pointer hover:text-red-600 transition-colors"
                            onClick={() => removeResearch(research)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interview Configuration */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Interview Configuration</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-gray-800 font-semibold text-lg">Max Interviews Per Day</Label>
                      <Select
                        onValueChange={(value) => handleInputChange("max_interviews_per_day", value)}
                        defaultValue="3"
                      >
                        <SelectTrigger className="h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Interview</SelectItem>
                          <SelectItem value="2">2 Interviews</SelectItem>
                          <SelectItem value="3">3 Interviews</SelectItem>
                          <SelectItem value="4">4 Interviews</SelectItem>
                          <SelectItem value="5">5 Interviews</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-gray-800 font-semibold text-lg">Interview Types</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["technical", "hr", "behavioral", "coding"].map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant={interviewTypes.includes(type) ? "default" : "outline"}
                            onClick={() => toggleInterviewType(type)}
                            className={`h-12 capitalize ${
                              interviewTypes.includes(type)
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                                : "border-gray-200 hover:border-indigo-500"
                            }`}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-gray-800 font-semibold text-lg">Preferred Interview Time Slots</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["09:00-12:00", "10:00-13:00", "11:00-14:00", "14:00-17:00", "15:00-18:00", "16:00-19:00"].map(
                        (slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={timeSlots.includes(slot) ? "default" : "outline"}
                            onClick={() => (timeSlots.includes(slot) ? removeTimeSlot(slot) : addTimeSlot(slot))}
                            className={`h-14 text-lg ${
                              timeSlots.includes(slot)
                                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                                : "border-gray-200 hover:border-emerald-500"
                            }`}
                          >
                            {slot}
                          </Button>
                        ),
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {timeSlots.map((slot, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                        >
                          {slot}
                          <X
                            className="h-4 w-4 cursor-pointer hover:text-red-600 transition-colors"
                            onClick={() => removeTimeSlot(slot)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-6 pt-8 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 h-14 text-lg border-gray-300 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || expertiseAreas.length === 0}
                    className="flex-1 h-14 text-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding Faculty...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add Faculty Member
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
