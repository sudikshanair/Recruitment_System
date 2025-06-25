"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, User, Calendar, FileText, GraduationCap, Award, MessageSquare, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Interview {
  id: string
  candidate_name: string
  candidate_email: string
  candidate_phone?: string
  scheduled_date: string
  round_number: number
  interview_type: string
  candidate_resume_url?: string
  candidate_qualifications?: string
  candidate_experience?: string
}

export default function AssessmentPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [interview, setInterview] = useState<Interview | null>(null)

  // Assessment scores based on the uploaded forms [^7][^8]
  const [scores, setScores] = useState({
    educational_background: [7],
    experience: [7],
    teaching_experience: [7],
    technical_content: [7],
    publications: [7],
    communication_skills: [7],
    personality_attitude: [7],
  })

  const [formData, setFormData] = useState({
    comments: "",
    recommendation: "",
    strengths: "",
    areas_for_improvement: "",
    overall_impression: "",
  })

  useEffect(() => {
    fetchInterview()
  }, [])

  const fetchInterview = async () => {
    try {
      const response = await fetch(`/api/interviews/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("session_token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setInterview(data)
      }
    } catch (error) {
      console.error("Error fetching interview:", error)
    }
  }

  const handleScoreChange = (field: string, value: number[]) => {
    setScores((prev) => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateTotalScore = () => {
    const totalPoints = Object.values(scores).reduce((sum, score) => sum + score[0], 0)
    return totalPoints
  }

  const getScoreInterpretation = (score: number) => {
    if (score >= 9) return { label: "Excellent", color: "text-green-600" }
    if (score >= 7) return { label: "Good", color: "text-blue-600" }
    if (score >= 5) return { label: "Average", color: "text-yellow-600" }
    if (score >= 3) return { label: "Below Average", color: "text-orange-600" }
    return { label: "Poor", color: "text-red-600" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const assessmentData = {
        interview_id: params.id,
        scores: scores,
        total_score: calculateTotalScore(),
        comments: formData.comments,
        recommendation: formData.recommendation,
        strengths: formData.strengths,
        areas_for_improvement: formData.areas_for_improvement,
        overall_impression: formData.overall_impression,
      }

      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("session_token")}`,
        },
        body: JSON.stringify(assessmentData),
      })

      if (response.ok) {
        router.push("/dashboard/faculty")
      } else {
        console.error("Failed to submit assessment")
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading assessment form...</p>
        </div>
      </div>
    )
  }

  const totalScore = calculateTotalScore()
  const maxScore = Object.keys(scores).length * 10

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/faculty"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Faculty Assessment Form
            </h1>
            <p className="text-gray-600">
              Evaluate the candidate's performance and suitability for the academic position
            </p>
          </div>

          {/* Candidate Details */}
          <Card className="mb-8 bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-6 w-6 text-emerald-600" />
                Candidate Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{interview.candidate_name}</p>
                    <p className="text-sm text-gray-600">{interview.candidate_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(interview.scheduled_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Interview Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    Round {interview.round_number}
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">{interview.interview_type}</Badge>
                </div>

                <div className="flex gap-2">
                  {interview.candidate_resume_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(interview.candidate_resume_url, "_blank")}
                      className="bg-white/50 backdrop-blur-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Form */}
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-6 w-6 text-amber-600" />
                Assessment Criteria
              </CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {totalScore}/{maxScore}
                </div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Educational Background */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    <Label className="text-lg font-semibold text-gray-800">Educational Background (15 marks)</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    Evaluate PhD, Masters, Bachelors, Diploma or equivalent qualifications
                  </p>
                  <div className="ml-7 space-y-3">
                    <Slider
                      value={scores.educational_background}
                      onValueChange={(value) => handleScoreChange("educational_background", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Poor (1)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">
                          {scores.educational_background[0]}/10
                        </Badge>
                        <span className={getScoreInterpretation(scores.educational_background[0]).color}>
                          {getScoreInterpretation(scores.educational_background[0]).label}
                        </span>
                      </div>
                      <span className="text-gray-500">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Experience */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <Label className="text-lg font-semibold text-gray-800">Professional Experience (10 marks)</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    Academic (teaching/research) and Non-Academic (Administration, Team Management) experience
                  </p>
                  <div className="ml-7 space-y-3">
                    <Slider
                      value={scores.experience}
                      onValueChange={(value) => handleScoreChange("experience", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Poor (1)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">
                          {scores.experience[0]}/10
                        </Badge>
                        <span className={getScoreInterpretation(scores.experience[0]).color}>
                          {getScoreInterpretation(scores.experience[0]).label}
                        </span>
                      </div>
                      <span className="text-gray-500">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Teaching Experience */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <Label className="text-lg font-semibold text-gray-800">Teaching Experience (20 marks)</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    Relevance of teaching experience, guiding/mentoring capabilities
                  </p>
                  <div className="ml-7 space-y-3">
                    <Slider
                      value={scores.teaching_experience}
                      onValueChange={(value) => handleScoreChange("teaching_experience", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Poor (1)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">
                          {scores.teaching_experience[0]}/10
                        </Badge>
                        <span className={getScoreInterpretation(scores.teaching_experience[0]).color}>
                          {getScoreInterpretation(scores.teaching_experience[0]).label}
                        </span>
                      </div>
                      <span className="text-gray-500">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Technical Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <Label className="text-lg font-semibold text-gray-800">Technical Content (20 marks)</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    Knowledge clarity, technical grasp, and subject matter expertise
                  </p>
                  <div className="ml-7 space-y-3">
                    <Slider
                      value={scores.technical_content}
                      onValueChange={(value) => handleScoreChange("technical_content", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Poor (1)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">
                          {scores.technical_content[0]}/10
                        </Badge>
                        <span className={getScoreInterpretation(scores.technical_content[0]).color}>
                          {getScoreInterpretation(scores.technical_content[0]).label}
                        </span>
                      </div>
                      <span className="text-gray-500">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Publications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    <Label className="text-lg font-semibold text-gray-800">Publications (15 marks)</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    International and National publications, conferences, research projects
                  </p>
                  <div className="ml-7 space-y-3">
                    <Slider
                      value={scores.publications}
                      onValueChange={(value) => handleScoreChange("publications", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Poor (1)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">
                          {scores.publications[0]}/10
                        </Badge>
                        <span className={getScoreInterpretation(scores.publications[0]).color}>
                          {getScoreInterpretation(scores.publications[0]).label}
                        </span>
                      </div>
                      <span className="text-gray-500">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Communication Skills */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-pink-600" />
                    <Label className="text-lg font-semibold text-gray-800">Communication Skills (15 marks)</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">Verbal, non-verbal communication and presentation skills</p>
                  <div className="ml-7 space-y-3">
                    <Slider
                      value={scores.communication_skills}
                      onValueChange={(value) => handleScoreChange("communication_skills", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Poor (1)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">
                          {scores.communication_skills[0]}/10
                        </Badge>
                        <span className={getScoreInterpretation(scores.communication_skills[0]).color}>
                          {getScoreInterpretation(scores.communication_skills[0]).label}
                        </span>
                      </div>
                      <span className="text-gray-500">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personality & Attitude */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-600" />
                    <Label className="text-lg font-semibold text-gray-800">Personality & Attitude (5 marks)</Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    General attitude, preparedness, and overall personality assessment
                  </p>
                  <div className="ml-7 space-y-3">
                    <Slider
                      value={scores.personality_attitude}
                      onValueChange={(value) => handleScoreChange("personality_attitude", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Poor (1)</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">
                          {scores.personality_attitude[0]}/10
                        </Badge>
                        <span className={getScoreInterpretation(scores.personality_attitude[0]).color}>
                          {getScoreInterpretation(scores.personality_attitude[0]).label}
                        </span>
                      </div>
                      <span className="text-gray-500">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Detailed Comments */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Detailed Evaluation</h3>

                  <div>
                    <Label htmlFor="strengths" className="text-base font-medium">
                      Candidate's Strengths
                    </Label>
                    <Textarea
                      id="strengths"
                      placeholder="Highlight the candidate's key strengths and positive attributes..."
                      value={formData.strengths}
                      onChange={(e) => handleInputChange("strengths", e.target.value)}
                      rows={3}
                      className="mt-2 bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="areas_for_improvement" className="text-base font-medium">
                      Areas for Improvement
                    </Label>
                    <Textarea
                      id="areas_for_improvement"
                      placeholder="Identify areas where the candidate could improve..."
                      value={formData.areas_for_improvement}
                      onChange={(e) => handleInputChange("areas_for_improvement", e.target.value)}
                      rows={3}
                      className="mt-2 bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="overall_impression" className="text-base font-medium">
                      Overall Impression
                    </Label>
                    <Textarea
                      id="overall_impression"
                      placeholder="Provide your overall impression of the candidate..."
                      value={formData.overall_impression}
                      onChange={(e) => handleInputChange("overall_impression", e.target.value)}
                      rows={3}
                      className="mt-2 bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="comments" className="text-base font-medium">
                      Additional Comments
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Any additional comments or observations..."
                      value={formData.comments}
                      onChange={(e) => handleInputChange("comments", e.target.value)}
                      rows={4}
                      className="mt-2 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Recommendation */}
                <div>
                  <Label htmlFor="recommendation" className="text-base font-medium">
                    Final Recommendation *
                  </Label>
                  <Select
                    value={formData.recommendation}
                    onValueChange={(value) => handleInputChange("recommendation", value)}
                  >
                    <SelectTrigger className="mt-2 bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select your recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strongly_recommend">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Strongly Recommend - Excellent candidate</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="recommend">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Recommend - Good candidate</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="conditional">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Conditional - Needs improvement</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="not_recommend">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Do Not Recommend - Not suitable</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 bg-white/50 backdrop-blur-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.recommendation}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                  >
                    {loading ? "Submitting Assessment..." : "Submit Assessment"}
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
