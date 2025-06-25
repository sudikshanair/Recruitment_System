"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  FileText,
  Clock,
  Star,
  CheckCircle,
  Search,
  User,
  GraduationCap,
  Award,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Interview {
  id: string
  candidate_name: string
  candidate_email: string
  round_number: number
  scheduled_date: string
  status: string
  meeting_link: string
  interview_type: string
  candidate_phone?: string
  candidate_resume_url?: string
}

interface DashboardStats {
  total_interviews: number
  upcoming_interviews: number
  completed_interviews: number
  pending_evaluations: number
}

export default function FacultyDashboard() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({ name: "", role: "", id: "" })
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total_interviews: 0,
    upcoming_interviews: 0,
    completed_interviews: 0,
    pending_evaluations: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("session_token")
    const role = localStorage.getItem("user_role")
    const name = localStorage.getItem("user_name")
    const userId = localStorage.getItem("user_id")

    if (!token || role !== "faculty") {
      router.push("/auth/login?role=faculty")
      return
    }

    setUserInfo({ name: name || "", role: role || "", id: userId || "" })
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [interviewsResponse, statsResponse] = await Promise.all([
        fetch("/api/interviews/faculty", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session_token")}`,
          },
        }),
        fetch("/api/dashboard/faculty-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session_token")}`,
          },
        }),
      ])

      if (interviewsResponse.ok) {
        const interviewsData = await interviewsResponse.json()
        setInterviews(Array.isArray(interviewsData) ? interviewsData : [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("session_token")
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_name")
    localStorage.removeItem("user_id")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoundBadgeColor = (round: number) => {
    return round === 1
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-orange-100 text-orange-800 border-orange-200"
  }

  const getInterviewTypeColor = (type: string) => {
    switch (type) {
      case "technical":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "hr":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "behavioral":
        return "bg-teal-100 text-teal-800 border-teal-200"
      case "coding":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const upcomingInterviews = filteredInterviews.filter(
    (interview) => interview.status === "scheduled" || interview.status === "in_progress",
  )

  const completedInterviews = filteredInterviews.filter((interview) => interview.status === "completed")

  const pendingEvaluations = completedInterviews.filter((interview) => !interview.status.includes("evaluated"))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Faculty Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, <span className="font-semibold">{userInfo.name}</span>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80 transition-all duration-200"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Interviews</CardTitle>
              <Calendar className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {stats.total_interviews}
              </div>
              <p className="text-xs text-gray-600 mt-1">Assigned to you</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Upcoming</CardTitle>
              <Clock className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stats.upcoming_interviews}
              </div>
              <p className="text-xs text-gray-600 mt-1">Scheduled interviews</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.completed_interviews}
              </div>
              <p className="text-xs text-gray-600 mt-1">Interviews done</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending Evaluations</CardTitle>
              <Star className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.pending_evaluations}
              </div>
              <p className="text-xs text-gray-600 mt-1">Need assessment</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/60 backdrop-blur-md border-white/20 focus:bg-white/80 transition-all duration-200"
            />
          </div>
        </div>

        {/* Tabs for Interview Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Upcoming Interviews ({upcomingInterviews.length})
            </TabsTrigger>
            <TabsTrigger
              value="evaluations"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              Pending Evaluations ({pendingEvaluations.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              All Completed ({completedInterviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Interviews */}
          <TabsContent value="upcoming">
            {upcomingInterviews.length === 0 ? (
              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
                <CardContent className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Upcoming Interviews</h3>
                  <p className="text-gray-600">You don't have any interviews scheduled at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingInterviews.map((interview) => (
                  <Card
                    key={interview.id}
                    className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {interview.candidate_name}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                              {interview.candidate_email}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(interview.status)}>{interview.status.replace("_", " ")}</Badge>
                        <Badge className={getRoundBadgeColor(interview.round_number)}>
                          Round {interview.round_number}
                        </Badge>
                        <Badge className={getInterviewTypeColor(interview.interview_type)}>
                          {interview.interview_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{new Date(interview.scheduled_date).toLocaleString()}</span>
                      </div>

                      {interview.candidate_phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MessageSquare className="h-4 w-4" />
                          <span>{interview.candidate_phone}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                          onClick={() => window.open(interview.meeting_link, "_blank")}
                        >
                          Join Meeting
                        </Button>
                        {interview.candidate_resume_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(interview.candidate_resume_url, "_blank")}
                            className="bg-white/50 backdrop-blur-sm"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Evaluations */}
          <TabsContent value="evaluations">
            {pendingEvaluations.length === 0 ? (
              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
                <CardContent className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Pending Evaluations</h3>
                  <p className="text-gray-600">All completed interviews have been evaluated.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingEvaluations.map((interview) => (
                  <Card
                    key={interview.id}
                    className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                            <Award className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {interview.candidate_name}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                              {interview.candidate_email}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(interview.status)}>{interview.status.replace("_", " ")}</Badge>
                        <Badge className={getRoundBadgeColor(interview.round_number)}>
                          Round {interview.round_number}
                        </Badge>
                        <Badge className={getInterviewTypeColor(interview.interview_type)}>
                          {interview.interview_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{new Date(interview.scheduled_date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/assessment/${interview.id}`} className="flex-1">
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Fill Assessment
                          </Button>
                        </Link>
                        {interview.candidate_resume_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(interview.candidate_resume_url, "_blank")}
                            className="bg-white/50 backdrop-blur-sm"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Completed Interviews */}
          <TabsContent value="completed">
            {completedInterviews.length === 0 ? (
              <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Completed Interviews</h3>
                  <p className="text-gray-600">You haven't completed any interviews yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedInterviews.map((interview) => (
                  <Card
                    key={interview.id}
                    className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {interview.candidate_name}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                              {interview.candidate_email}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(interview.status)}>{interview.status.replace("_", " ")}</Badge>
                        <Badge className={getRoundBadgeColor(interview.round_number)}>
                          Round {interview.round_number}
                        </Badge>
                        <Badge className={getInterviewTypeColor(interview.interview_type)}>
                          {interview.interview_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{new Date(interview.scheduled_date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/assessment/${interview.id}/view`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-white/50 backdrop-blur-sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Assessment
                          </Button>
                        </Link>
                        {interview.candidate_resume_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(interview.candidate_resume_url, "_blank")}
                            className="bg-white/50 backdrop-blur-sm"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
