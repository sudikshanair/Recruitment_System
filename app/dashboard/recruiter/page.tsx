"use client"
import AddFacultyForm from "@/components/add_faculty_form";
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-600">Welcome! Manage all recruitment activities from here.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8">
        {/* Candidates Section */}
        <Card className="bg-white/80 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <GraduationCap className="w-5 h-5" /> Candidates
            </CardTitle>
            <CardDescription>Manage all candidates in the system</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/candidates">
              <Button variant="outline" className="border-emerald-200">
                <Users className="w-4 h-4 mr-2" /> View Candidates
              </Button>
            </Link>
            <Link href="/candidates/add">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" /> Add Candidate
              </Button>
            </Link>
            <Link href="/candidates">
              <Button variant="destructive">
                Delete Candidates
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Faculty/Interviewer Section */}
        <Card className="bg-white/80 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Building className="w-5 h-5" /> Faculty / Interviewers
            </CardTitle>
            <CardDescription>Manage faculty and interviewers</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/faculty">
              <Button variant="outline" className="border-emerald-200">
                <Users className="w-4 h-4 mr-2" /> View Faculty
              </Button>
            </Link>
            <Link href="/faculty/add">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" /> Add Faculty
              </Button>
            </Link>
            <Link href="/faculty">
              <Button variant="destructive">
                Delete Faculty
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Scheduling Interviews Section */}
        <Card className="bg-white/80 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Calendar className="w-5 h-5" /> Scheduling Interviews
            </CardTitle>
            <CardDescription>Search, assign, and view interview schedules</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/interviews/schedule">
              <Button>
                <Search className="w-4 h-4 mr-2" /> Search & Assign
              </Button>
            </Link>
            <Link href="/interviews">
              <Button variant="outline" className="border-emerald-200">
                <Clock className="w-4 h-4 mr-2" /> View Scheduled Interviews
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
