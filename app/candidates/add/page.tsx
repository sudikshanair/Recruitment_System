"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Plus, Upload, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddCandidatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    experience_years: "",
    current_company: "",
    expected_salary: "",
    notice_period: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        setResumeFile(file)
      } else {
        alert("Please select a PDF file")
      }
    }
  }

  const uploadResume = async (file: File): Promise<string> => {
    // Simulate file upload progress
    const formData = new FormData()
    formData.append("resume", file)

    // In a real application, you would upload to your storage service
    // For demo purposes, we'll simulate the upload
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 20
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          // Return a mock URL - in real app, this would be the actual uploaded file URL
          resolve(`/uploads/resumes/${file.name}`)
        }
      }, 200)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let resumeUrl = ""
      let resumeFilename = ""

      if (resumeFile) {
        resumeUrl = await uploadResume(resumeFile)
        resumeFilename = resumeFile.name
      }

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("session_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          experience_years: Number.parseInt(formData.experience_years),
          skills,
          resume_url: resumeUrl,
          resume_filename: resumeFilename,
        }),
      })

      if (response.ok) {
        router.push("/candidates")
      } else {
        const result = await response.json();
        console.error("Failed to add candidate", result.error);
        alert("Failed to add candidate: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding candidate:", error)
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Candidate</h1>
            <p className="text-gray-600">Fill in the candidate details and upload their resume</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience_years">Years of Experience *</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange("experience_years", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="current_company">Current Company</Label>
                  <Input
                    id="current_company"
                    value={formData.current_company}
                    onChange={(e) => handleInputChange("current_company", e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expected_salary">Expected Salary</Label>
                    <Input
                      id="expected_salary"
                      placeholder="e.g., $80,000 - $100,000"
                      value={formData.expected_salary}
                      onChange={(e) => handleInputChange("expected_salary", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notice_period">Notice Period</Label>
                    <Select onValueChange={(value) => handleInputChange("notice_period", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notice period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1 week">1 Week</SelectItem>
                        <SelectItem value="2 weeks">2 Weeks</SelectItem>
                        <SelectItem value="1 month">1 Month</SelectItem>
                        <SelectItem value="2 months">2 Months</SelectItem>
                        <SelectItem value="3 months">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <Label>Resume Upload *</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {resumeFile ? (
                            <>
                              <FileText className="w-8 h-8 mb-2 text-green-500" />
                              <p className="text-sm text-gray-600">{resumeFile.name}</p>
                              <p className="text-xs text-gray-500">
                                PDF • {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> resume
                              </p>
                              <p className="text-xs text-gray-500">PDF files only (MAX. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input
                          id="resume-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Button
                      type="button"
                      onClick={addSkill}
                      variant="outline"
                      className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {!resumeFile && (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Please upload the candidate's resume in PDF format. This is required for the interview process.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || !resumeFile} className="flex-1">
                    {loading ? "Adding..." : "Add Candidate"}
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
