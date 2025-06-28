"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Users } from "lucide-react"
import Link from "next/link"

interface Faculty {
  id: string
  full_name: string
  email: string
  phone: string
  department: string
  expertise_areas: string[]
  research_interests?: string[]
  max_interviews_per_day?: number
  status?: string
  designation?: string
  joining_date?: string
  qualification?: string
  experience_years?: number
  resume_url?: string
}

export default function FacultyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/faculty?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFaculty(data.find((f: Faculty) => f.id === id) || null)
        } else {
          setFaculty(data)
        }
      })
      .catch(() => setFaculty(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading faculty details...</p>
        </div>
      </div>
    )
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Faculty not found</h3>
          <Button onClick={() => router.back()}>Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Link href="/dashboard/recruiter">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{faculty.full_name}</CardTitle>
            <div className="flex gap-2 mt-2">
              {faculty.status && <Badge>{faculty.status}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4" />
              <span>{faculty.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4" />
              <span>{faculty.phone}</span>
            </div>
            <div className="text-gray-700">
              <strong>Department:</strong> {faculty.department}
            </div>
            {faculty.designation && (
              <div className="text-gray-700">
                <strong>Designation:</strong> {faculty.designation}
              </div>
            )}
            {faculty.qualification && (
              <div className="text-gray-700">
                <strong>Qualification:</strong> {faculty.qualification}
              </div>
            )}
            {faculty.joining_date && (
              <div className="text-gray-700">
                <strong>Joining Date:</strong> {faculty.joining_date}
              </div>
            )}
            {faculty.experience_years !== undefined && (
              <div className="text-gray-700">
                <strong>Experience:</strong> {faculty.experience_years} years
              </div>
            )}
            {faculty.max_interviews_per_day !== undefined && (
              <div className="text-gray-700">
                <strong>Max Interviews/Day:</strong> {faculty.max_interviews_per_day}
              </div>
            )}
            {faculty.expertise_areas && (
              <div>
                <strong>Expertise Areas:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {faculty.expertise_areas.map((area, idx) => (
                    <Badge key={idx} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            )}
            {faculty.research_interests && faculty.research_interests.length > 0 && (
              <div>
                <strong>Research Interests:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {faculty.research_interests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            {faculty.resume_url && (
              <div className="text-gray-700">
                <strong>Resume:</strong> <a href={faculty.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Resume</a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
