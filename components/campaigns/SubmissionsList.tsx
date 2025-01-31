"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, XCircle } from "lucide-react"

interface Submission {
  _id: string
  contentUrl: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

interface SubmissionsListProps {
  submissions: Submission[]
  campaignId: string
  influencerId: string
}

export function SubmissionsList({ submissions, campaignId, influencerId }: SubmissionsListProps) {
  const [submissionStatuses, setSubmissionStatuses] = useState<{ [key: string]: string }>(
    submissions.reduce((acc, submission) => ({ ...acc, [submission._id]: submission.status }), {}),
  )

  const handleStatusUpdate = async (submissionId: string, newStatus: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/brand/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setSubmissionStatuses((prev) => ({ ...prev, [submissionId]: newStatus }))
      } else {
        console.error("Failed to update submission status")
      }
    } catch (error) {
      console.error("Error updating submission status:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions for Influencer {influencerId}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission Date</TableHead>
              <TableHead>Content URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission._id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400" />
                    <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={submission.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Content
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      submissionStatuses[submission._id] === "approved"
                        ? "success"
                        : submissionStatuses[submission._id] === "rejected"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {submissionStatuses[submission._id]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(submission._id, "approved")}
                      disabled={submissionStatuses[submission._id] !== "pending"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(submission._id, "rejected")}
                      disabled={submissionStatuses[submission._id] !== "pending"}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

