"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Mail, Phone, Building, GraduationCap, Clock, Star, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Faculty {
  id: string
  full_name: string
  email: string
  phone: string
  profile_image: string
  employee_id: string
  department: string
  designation: string
  expertise_areas: string[]
  qualification: string
  experience_years: number
  specialization: string
  research_interests: string[]
  is_available: boolean
  max_interviews_per_day: number
  preferred_time_slots: string[]
  interview_types: string[]
}

export default function FacultyPage() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("session_token")
    const role = localStorage.getItem("user_role")

    if (!token || role !== "recruiter") {
      router.push("/auth/login?role=recruiter")
      return
    }

    fetchFaculty()
  }, [router])

  const fetchFaculty = async () => {
    try {
      const response = await fetch("/api/faculty")
      const data = await response.json()
      setFaculty(data)
    } catch (error) {
      console.error("Error fetching faculty:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFaculty = faculty.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.expertise_areas.some((area) => area.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Delete faculty handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) return;
    try {
      const res = await fetch(`/api/faculty/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaculty((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Failed to delete faculty member.");
      }
    } catch (err) {
      alert("Error deleting faculty member.");
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading faculty members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/recruiter" className="text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Faculty Management
                  </h1>
                  <p className="text-gray-600">Manage faculty members and their expertise areas</p>
                </div>
              </div>
            </div>
            <Link href="/faculty/add">
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg h-12 px-6">
                <Plus className="h-5 w-5 mr-2" />
                Add New Faculty
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search faculty by name, email, department, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFaculty.map((member) => (
            <Card
              key={member.id}
              className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                      <AvatarImage src={member.profile_image || "/placeholder.svg"} alt={member.full_name} />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-bold">
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{member.full_name}</CardTitle>
                      <CardDescription className="text-gray-600">{member.designation}</CardDescription>
                      {member.employee_id && (
                        <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
                          {member.employee_id}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={member.is_available ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}
                  >
                    {member.is_available ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-emerald-600" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building className="h-4 w-4 text-emerald-600" />
                    <span className="truncate">{member.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>{member.max_interviews_per_day} interviews/day max</span>
                  </div>
                  {member.experience_years && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-emerald-600" />
                      <span>{member.experience_years} years experience</span>
                    </div>
                  )}
                </div>

                {member.specialization && (
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-2">Specialization:</p>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {member.specialization}
                    </Badge>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-3">Expertise Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise_areas.slice(0, 4).map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                        {area}
                      </Badge>
                    ))}
                    {member.expertise_areas.length > 4 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        +{member.expertise_areas.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {member.research_interests && member.research_interests.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Research Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.research_interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-cyan-100 text-cyan-800">
                          {interest}
                        </Badge>
                      ))}
                      {member.research_interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          +{member.research_interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {member.interview_types && member.interview_types.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Interview Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.interview_types.map((type, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-indigo-100 text-indigo-800 capitalize"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link href={`/faculty/${member.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/interviews/schedule?faculty=${member.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                      disabled={!member.is_available}
                    >
                      Assign Interview
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDelete(member.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-gray-400 mb-6">
                  <Users className="h-20 w-20 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No faculty members found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first faculty member"}
                </p>
                <Link href="/faculty/add">
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Faculty
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
