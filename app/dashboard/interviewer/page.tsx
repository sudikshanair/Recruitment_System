"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Clock, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Interview {
  id: string
  candidate_name: string
  candidate_email: string
  job_title: string
  round_number: number
  scheduled_date: string
  status: string
  meeting_link: string
}

interface Interview {
  id: string
  candidate_name: string
  candidate_email: string
  round_number: number
  scheduled_date: string
  status: string
  meeting_link: string
}

export default function InterviewerDashboard() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({ name: "", role: "" })
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("session_token")
    const role = localStorage.getItem("user_role")
    const name = localStorage.getItem("user_name")

    if (!token || role !== "interviewer") {
      router.push("/auth/login?role=interviewer")
      return
    }

    setUserInfo({ name: name || "", role: role || "" })
    fetchInterviews()
  }, [router])

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interviews/my-interviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("session_token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setInterviews(data)
      }
    } catch (error) {
      console.error("Error fetching interviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("session_token")
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_name")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoundBadgeColor = (round: number) => {
    return round === 1 ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"
  }

  const upcomingInterviews = interviews.filter((interview) => interview.status === "scheduled")
  const completedInterviews = interviews.filter((interview) => interview.status === "completed")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your interviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userInfo.name}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{interviews.length}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingInterviews.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled interviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedInterviews.length}</div>
              <p className="text-xs text-muted-foreground">Interviews done</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Scores</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedInterviews.filter((i) => !i.status.includes("scored")).length}
              </div>
              <p className="text-xs text-muted-foreground">Need evaluation</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming interviews scheduled</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingInterviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{interview.candidate_name}</CardTitle>
                        <CardDescription>{interview.candidate_email}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                        <Badge className={getRoundBadgeColor(interview.round_number)}>
                          Round {interview.round_number}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(interview.scheduled_date).toLocaleString()}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(interview.meeting_link, "_blank")}
                        >
                          Join Meeting
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Interviews - Need Scoring */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Interviews - Pending Evaluation</h2>
          {completedInterviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No completed interviews to evaluate</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedInterviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{interview.candidate_name}</CardTitle>
                        <CardDescription>{interview.candidate_email}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                        <Badge className={getRoundBadgeColor(interview.round_number)}>
                          Round {interview.round_number}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(interview.scheduled_date).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Link href={`/interviews/score/${interview.id}`} className="flex-1">
                          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                            <Star className="h-4 w-4 mr-2" />
                            Evaluate Candidate
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
