"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Mail, Phone, Building } from "lucide-react"
import Link from "next/link"

interface Interviewer {
  id: string
  full_name: string
  email: string
  phone: string
  department: string
  expertise_areas: string[]
  is_available: boolean
}

export default function InterviewersPage() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInterviewers()
  }, [])

  const fetchInterviewers = async () => {
    try {
      const response = await fetch("/api/interviewers")
      const data = await response.json()
      setInterviewers(data)
    } catch (error) {
      console.error("Error fetching interviewers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInterviewers = interviewers.filter(
    (interviewer) =>
      interviewer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer.expertise_areas.some((area) => area.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interviewers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviewers</h1>
            <p className="text-gray-600">Manage faculty members and interviewer profiles</p>
          </div>
          <Link href="/interviewers/add">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Interviewer
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search interviewers by name, email, department, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Interviewers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviewers.map((interviewer) => (
            <Card key={interviewer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{interviewer.full_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {interviewer.email}
                    </CardDescription>
                  </div>
                  <Badge
                    className={interviewer.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {interviewer.is_available ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {interviewer.phone}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-3 w-3" />
                    {interviewer.department}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Expertise Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {interviewer.expertise_areas.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {interviewer.expertise_areas.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{interviewer.expertise_areas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/interviewers/${interviewer.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/interviews/schedule?interviewer=${interviewer.id}`} className="flex-1">
                      <Button size="sm" className="w-full" disabled={!interviewer.is_available}>
                        Assign Interview
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInterviewers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviewers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first interviewer"}
            </p>
            <Link href="/interviewers/add">
              <Button>Add New Interviewer</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
