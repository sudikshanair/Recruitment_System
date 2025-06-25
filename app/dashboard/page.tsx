import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Briefcase, Mail, Plus, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-600">Manage your recruitment process efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 scheduled today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Profiles</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">2 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 today</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manage Candidates
              </CardTitle>
              <CardDescription>Add new candidates and view existing profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/candidates">
                  <Button className="w-full">View All Candidates</Button>
                </Link>
                <Link href="/candidates/add">
                  <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Candidate
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manage Interviewers
              </CardTitle>
              <CardDescription>Add faculty members and manage interviewer profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/interviewers">
                  <Button className="w-full">View All Interviewers</Button>
                </Link>
                <Link href="/interviewers/add">
                  <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Interviewer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Profiles
              </CardTitle>
              <CardDescription>Create and manage job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/jobs">
                  <Button className="w-full">View All Jobs</Button>
                </Link>
                <Link href="/jobs/add">
                  <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Job
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Interviews
              </CardTitle>
              <CardDescription>Assign candidates to interviewers and schedule meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/interviews">
                  <Button className="w-full">View All Interviews</Button>
                </Link>
                <Link href="/interviews/schedule">
                  <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Management
              </CardTitle>
              <CardDescription>View sent emails and manage templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/emails">
                  <Button className="w-full">Email History</Button>
                </Link>
                <Link href="/emails/templates">
                  <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                    Manage Templates
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Interview Scores
              </CardTitle>
              <CardDescription>View interview results and candidate evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/scores">
                  <Button className="w-full">View All Scores</Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                    Generate Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
