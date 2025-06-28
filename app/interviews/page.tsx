"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Interview {
  id: string
  candidate: { full_name: string, email: string }
  interviewer: { full_name: string, email: string }
  scheduled_date: string
  status: string // e.g. "scheduled", "completed", etc.
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/interviews")
      .then(res => res.json())
      .then(data => setInterviews(data))
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()

  const upcoming = interviews.filter(i => new Date(i.scheduled_date) > now)
  const past = interviews.filter(i => new Date(i.scheduled_date) <= now)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Scheduled Interviews</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="text-gray-500">No upcoming interviews.</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Candidate</th>
                      <th className="text-left p-2">Interviewer</th>
                      <th className="text-left p-2">Date & Time</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map(i => (
                      <tr key={i.id}>
                        <td className="p-2">{i.candidate.full_name} <span className="text-gray-400">({i.candidate.email})</span></td>
                        <td className="p-2">{i.interviewer.full_name} <span className="text-gray-400">({i.interviewer.email})</span></td>
                        <td className="p-2">{new Date(i.scheduled_date).toLocaleString()}</td>
                        <td className="p-2">{i.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Past Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              {past.length === 0 ? (
                <div className="text-gray-500">No past interviews.</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Candidate</th>
                      <th className="text-left p-2">Interviewer</th>
                      <th className="text-left p-2">Date & Time</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {past.map(i => (
                      <tr key={i.id}>
                        <td className="p-2">{i.candidate.full_name} <span className="text-gray-400">({i.candidate.email})</span></td>
                        <td className="p-2">{i.interviewer.full_name} <span className="text-gray-400">({i.interviewer.email})</span></td>
                        <td className="p-2">{new Date(i.scheduled_date).toLocaleString()}</td>
                        <td className="p-2">{i.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
