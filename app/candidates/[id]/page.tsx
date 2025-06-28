"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface Candidate {
  id: string
  full_name: string
  email: string
  phone: string
  experience_years: number
  skills: string[]
  current_company: string
  expected_salary: string
  status: string
  notice_period?: string
  resume_url?: string
}

export default function CandidateDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/candidates?id=${id}`)
      .then(res => res.json())
      .then(data => {
        // If API returns a list, find the candidate by id
        if (Array.isArray(data)) {
          setCandidate(data.find((c: Candidate) => c.id === id) || null)
        } else {
          setCandidate(data)
        }
      })
      .catch(() => setCandidate(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidate not found</h3>
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
            <CardTitle className="text-2xl">{candidate.full_name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge>{candidate.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4" />
              <span>{candidate.current_company}</span>
            </div>
            <div className="text-gray-700">
              <strong>Experience:</strong> {candidate.experience_years} years
            </div>
            <div className="text-gray-700">
              <strong>Expected Salary:</strong> {candidate.expected_salary}
            </div>
            {candidate.notice_period && (
              <div className="text-gray-700">
                <strong>Notice Period:</strong> {candidate.notice_period}
              </div>
            )}
            <div>
              <strong>Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {candidate.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            {candidate.resume_url && (
              <div className="text-gray-700">
                <strong>Resume:</strong> <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Resume</a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
