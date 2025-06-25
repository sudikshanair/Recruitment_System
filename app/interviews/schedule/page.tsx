"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Candidate {
  id: string
  full_name: string
  email: string
}

interface Interviewer {
  id: string
  full_name: string
  email: string
  is_available: boolean
}

interface JobProfile {
  id: string
  title: string
}

export default function ScheduleInterviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [interviewers, setInterviewers] = useState<Interviewer[]>([])
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([])

  const [formData, setFormData] = useState({
    candidate_id: searchParams.get("candidate") || "",
    interviewer_id: searchParams.get("interviewer") || "",
    scheduled_date: "",
    scheduled_time: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [candidatesRes, interviewersRes, jobsRes] = await Promise.all([
        fetch("/api/candidates"),
        fetch("/api/interviewers"),
        fetch("/api/jobs"),
      ])

      const [candidatesData, interviewersData, jobsData] = await Promise.all([
        candidatesRes.json(),
        interviewersRes.json(),
        jobsRes.json(),
      ])

      setCandidates(candidatesData)
      setInterviewers(interviewersData.filter((i: Interviewer) => i.is_available))
      setJobProfiles(jobsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`)

      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          scheduled_date: scheduledDateTime.toISOString(),
        }),
      })

      if (response.ok) {
        router.push("/interviews")
      } else {
        console.error("Failed to schedule interview")
      }
    } catch (error) {
      console.error("Error scheduling interview:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Interview</h1>
            <p className="text-gray-600">Assign a candidate to an interviewer and set the meeting time</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Interview Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="candidate_id">Select Candidate *</Label>
                  <Select
                    value={formData.candidate_id}
                    onValueChange={(value) => handleInputChange("candidate_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a candidate">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Select candidate</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((candidate) => (
                        <SelectItem key={candidate.id} value={candidate.id}>
                          <div className="flex flex-col">
                            <span>{candidate.full_name}</span>
                            <span className="text-sm text-gray-500">{candidate.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interviewer_id">Select Interviewer *</Label>
                  <Select
                    value={formData.interviewer_id}
                    onValueChange={(value) => handleInputChange("interviewer_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an interviewer">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Select interviewer</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {interviewers.map((interviewer) => (
                        <SelectItem key={interviewer.id} value={interviewer.id}>
                          <div className="flex flex-col">
                            <span>{interviewer.full_name}</span>
                            <span className="text-sm text-gray-500">{interviewer.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduled_date">Interview Date *</Label>
                    <Input
                      id="scheduled_date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => handleInputChange("scheduled_date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduled_time">Interview Time *</Label>
                    <Input
                      id="scheduled_time"
                      type="time"
                      value={formData.scheduled_time}
                      onChange={(e) => handleInputChange("scheduled_time", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Automatic Notifications</h4>
                      <p className="text-sm text-blue-700">
                        Once scheduled, both the candidate and interviewer will receive email notifications with the
                        interview details and a Microsoft Teams meeting link.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Scheduling..." : "Schedule Interview"}
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
