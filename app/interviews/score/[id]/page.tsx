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
import { Star, User, Calendar, FileText } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface Interview {
  id: string
  candidate_name: string
  candidate_email: string
  scheduled_date: string
  round_number: number
  resume_url?: string
}

export default function ScoreInterviewPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [interview, setInterview] = useState<Interview | null>(null)

  // Round 1 scores (Technical Assessment)
  const [round1Scores, setRound1Scores] = useState({
    technical_knowledge: [5],
    coding_skills: [5],
    problem_solving: [5],
    communication: [5],
  })

  // Round 2 scores (HR/Cultural Fit)
  const [round2Scores, setRound2Scores] = useState({
    cultural_fit: [5],
    leadership_potential: [5],
    team_collaboration: [5],
    motivation: [5],
  })

  const [overallRating, setOverallRating] = useState([5])
  const [formData, setFormData] = useState({
    comments: "",
    recommendation: "",
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
      const data = await response.json()
      setInterview(data)
    } catch (error) {
      console.error("Error fetching interview:", error)
    }
  }

  const handleRound1ScoreChange = (field: string, value: number[]) => {
    setRound1Scores((prev) => ({ ...prev, [field]: value }))
  }

  const handleRound2ScoreChange = (field: string, value: number[]) => {
    setRound2Scores((prev) => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const scoreData = {
        interview_id: params.id,
        round_number: interview?.round_number,
        overall_rating: overallRating[0],
        comments: formData.comments,
        recommendation: formData.recommendation,
      }

      // Add round-specific scores
      if (interview?.round_number === 1) {
        Object.assign(scoreData, {
          technical_knowledge: round1Scores.technical_knowledge[0],
          coding_skills: round1Scores.coding_skills[0],
          problem_solving: round1Scores.problem_solving[0],
          communication: round1Scores.communication[0],
        })
      } else {
        Object.assign(scoreData, {
          cultural_fit: round2Scores.cultural_fit[0],
          leadership_potential: round2Scores.leadership_potential[0],
          team_collaboration: round2Scores.team_collaboration[0],
          motivation: round2Scores.motivation[0],
        })
      }

      const response = await fetch("/api/interviews/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("session_token")}`,
        },
        body: JSON.stringify(scoreData),
      })

      if (response.ok) {
        router.push("/dashboard/interviewer")
      } else {
        console.error("Failed to submit score")
      }
    } catch (error) {
      console.error("Error submitting score:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview details...</p>
        </div>
      </div>
    )
  }

  const isRound1 = interview.round_number === 1
  const roundTitle = isRound1 ? "Round 1 - Technical Assessment" : "Round 2 - HR & Cultural Fit"
  const roundColor = isRound1 ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Evaluation</h1>
            <p className="text-gray-600">Score the candidate's performance and provide feedback</p>
          </div>

          {/* Interview Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Interview Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{interview.candidate_name}</p>
                    <p className="text-sm text-gray-500">{interview.candidate_email}</p>
                  </div>
                </div>
                {/* Remove job title display */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{new Date(interview.scheduled_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Interview Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={roundColor}>{roundTitle}</Badge>
                  {interview.resume_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(interview.resume_url, "_blank")}
                      className="ml-2"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Resume
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                {roundTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Round 1 Criteria */}
                {isRound1 && (
                  <>
                    <div>
                      <Label className="text-base font-medium">Technical Knowledge</Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Rate the candidate's understanding of technical concepts and domain knowledge
                      </p>
                      <div className="space-y-2">
                        <Slider
                          value={round1Scores.technical_knowledge}
                          onValueChange={(value) => handleRound1ScoreChange("technical_knowledge", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round1Scores.technical_knowledge[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Coding Skills</Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Evaluate programming ability, code quality, and problem-solving approach
                      </p>
                      <div className="space-y-2">
                        <Slider
                          value={round1Scores.coding_skills}
                          onValueChange={(value) => handleRound1ScoreChange("coding_skills", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round1Scores.coding_skills[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Problem Solving</Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Assess analytical thinking and approach to complex challenges
                      </p>
                      <div className="space-y-2">
                        <Slider
                          value={round1Scores.problem_solving}
                          onValueChange={(value) => handleRound1ScoreChange("problem_solving", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round1Scores.problem_solving[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Communication</Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Evaluate clarity, articulation, and ability to explain technical concepts
                      </p>
                      <div className="space-y-2">
                        <Slider
                          value={round1Scores.communication}
                          onValueChange={(value) => handleRound1ScoreChange("communication", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round1Scores.communication[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Round 2 Criteria */}
                {!isRound1 && (
                  <>
                    <div>
                      <Label className="text-base font-medium">Cultural Fit</Label>
                      <p className="text-sm text-gray-600 mb-4">
                        How well does the candidate align with company values and culture
                      </p>
                      <div className="space-y-2">
                        <Slider
                          value={round2Scores.cultural_fit}
                          onValueChange={(value) => handleRound2ScoreChange("cultural_fit", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round2Scores.cultural_fit[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Leadership Potential</Label>
                      <p className="text-sm text-gray-600 mb-4">Assess leadership qualities and potential for growth</p>
                      <div className="space-y-2">
                        <Slider
                          value={round2Scores.leadership_potential}
                          onValueChange={(value) => handleRound2ScoreChange("leadership_potential", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round2Scores.leadership_potential[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Team Collaboration</Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Evaluate ability to work effectively in team environments
                      </p>
                      <div className="space-y-2">
                        <Slider
                          value={round2Scores.team_collaboration}
                          onValueChange={(value) => handleRound2ScoreChange("team_collaboration", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round2Scores.team_collaboration[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Motivation & Enthusiasm</Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Assess candidate's motivation and enthusiasm for the role
                      </p>
                      <div className="space-y-2">
                        <Slider
                          value={round2Scores.motivation}
                          onValueChange={(value) => handleRound2ScoreChange("motivation", value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Poor (1)</span>
                          <Badge variant="secondary">{round2Scores.motivation[0]}/10</Badge>
                          <span>Excellent (10)</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Overall Rating */}
                <div>
                  <Label className="text-base font-medium">Overall Rating</Label>
                  <p className="text-sm text-gray-600 mb-4">Your overall impression of the candidate for this round</p>
                  <div className="space-y-2">
                    <Slider
                      value={overallRating}
                      onValueChange={setOverallRating}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Poor (1)</span>
                      <Badge variant="secondary">{overallRating[0]}/10</Badge>
                      <span>Excellent (10)</span>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder={`Provide detailed feedback about the candidate's performance in ${roundTitle.toLowerCase()}...`}
                    value={formData.comments}
                    onChange={(e) => handleInputChange("comments", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Recommendation */}
                <div>
                  <Label htmlFor="recommendation">Recommendation *</Label>
                  <Select
                    value={formData.recommendation}
                    onValueChange={(value) => handleInputChange("recommendation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      {isRound1 ? (
                        <>
                          <SelectItem value="proceed_to_round2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Proceed to Round 2</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="reject">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>Reject - Not suitable</span>
                            </div>
                          </SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="hire">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Hire - Strong candidate</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="maybe">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span>Maybe - Needs further evaluation</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="reject">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>Reject - Not suitable</span>
                            </div>
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
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
                  <Button type="submit" disabled={loading || !formData.recommendation} className="flex-1">
                    {loading ? "Submitting..." : "Submit Evaluation"}
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
