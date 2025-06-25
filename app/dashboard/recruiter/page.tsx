"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Users,
  Calendar,
  UserPlus,
  Search,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Clock,
  Star,
  Plus,
} from "lucide-react"
import Link from "next/link"

interface Faculty {
  id: string
  full_name: string
  email: string
  phone: string
  department: string
  expertise_areas: string[]
  research_interests: string[]
  qualifications: string
  interview_types: string[]
  is_available: boolean
  max_interviews_per_week: number
}

interface Stats {
  total_faculty: number
  total_candidates: number
  scheduled_interviews: number
  completed_interviews: number
}

export default function RecruiterDashboard() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [stats, setStats] = useState<Stats>({
    total_faculty: 0,
    total_candidates: 0,
    scheduled_interviews: 0,
    completed_interviews: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      /* ---------- FACULTY ---------- */
      const facultyRes = await fetch("/api/faculty")
      const facultyJson: unknown = facultyRes.ok ? await facultyRes.json() : []

      const facultyData: Faculty[] = Array.isArray(facultyJson)
        ? facultyJson
        : // shape could be { data: [...] }
          Array.isArray((facultyJson as any)?.data)
          ? (facultyJson as any).data
          : []

      /* ---------- DASHBOARD STATS ---------- */
      const statsRes = await fetch("/api/dashboard/stats")
      const statsJson: unknown = statsRes.ok ? await statsRes.json() : {}

      const statsData: Stats = ((): Stats => {
        if (statsJson && typeof statsJson === "object") {
          return "data" in (statsJson as any) ? (statsJson as any).data : (statsJson as Stats)
        }
        return {
          total_faculty: 0,
          total_candidates: 0,
          scheduled_interviews: 0,
          completed_interviews: 0,
        }
      })()

      setFaculty(facultyData)
      setStats(statsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFaculty = (Array.isArray(faculty) ? faculty : []).filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.expertise_areas.some((area) => area.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment

    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(faculty.map((f) => f.department))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Recruiter Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage faculty and recruitment process</p>
            </div>
            <div className="flex gap-3">
              <Link href="/faculty/add">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Faculty
                </Button>
              </Link>
              <Link href="/candidates/add">
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-emerald-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Faculty</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{stats.total_faculty}</div>
              <p className="text-xs text-gray-500 mt-1">Active interviewers</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-teal-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
              <GraduationCap className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-700">{stats.total_candidates}</div>
              <p className="text-xs text-gray-500 mt-1">In pipeline</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-cyan-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-700">{stats.scheduled_interviews}</div>
              <p className="text-xs text-gray-500 mt-1">Upcoming interviews</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-emerald-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <Clock className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{stats.completed_interviews}</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Management */}
        <Card className="bg-white/70 backdrop-blur-sm border-emerald-100 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-800">Faculty Management</CardTitle>
                <CardDescription>Manage your interview panel and faculty members</CardDescription>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search faculty by name, email, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-emerald-200 focus:border-emerald-400"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent>
            {filteredFaculty.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Faculty Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedDepartment !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start by adding your first faculty member"}
                </p>
                <Link href="/faculty/add">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Faculty
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFaculty.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12 border-2 border-emerald-200">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.full_name}`} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                              {member.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-800">{member.full_name}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Building className="w-3 h-3 mr-1" />
                              {member.department}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={member.is_available ? "default" : "secondary"}
                          className={
                            member.is_available
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {member.is_available ? "Available" : "Busy"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-2 text-emerald-600" />
                        {member.email}
                      </div>

                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-2 text-emerald-600" />
                          {member.phone}
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Expertise Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise_areas.slice(0, 3).map((area, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-emerald-200 text-emerald-700"
                            >
                              {area}
                            </Badge>
                          ))}
                          {member.expertise_areas.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                              +{member.expertise_areas.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Interview Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.interview_types.map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-teal-100 text-teal-700">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-emerald-100">
                        <span>Max interviews/week: {member.max_interviews_per_week}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
