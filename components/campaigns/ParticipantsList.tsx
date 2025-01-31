"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Search, User, Eye } from "lucide-react"

interface Participant {
  _id: string
  influencerId: string
  status: string
}

interface Submission {
  _id: string
  influencerId: string
  submittedAt: string
  status: string
}

interface ParticipantsListProps {
  participants: Participant[]
  submissions: Submission[]
  campaignId: string
}

export function ParticipantsList({ participants, submissions, campaignId }: ParticipantsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const getSubmissionCount = (influencerId: string) => {
    return submissions.filter((sub) => sub.influencerId === influencerId).length
  }

  const getLastSubmissionDate = (influencerId: string) => {
    const influencerSubmissions = submissions.filter((sub) => sub.influencerId === influencerId)
    if (influencerSubmissions.length === 0) return "N/A"
    return new Date(
      Math.max(...influencerSubmissions.map((sub) => new Date(sub.submittedAt).getTime())),
    ).toLocaleDateString()
  }

  const filteredParticipants = participants.filter((participant) =>
    participant.influencerId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewSubmissions = (influencerId: string) => {
    router.push(`/brand/campaigns/${campaignId}/submissions/${influencerId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Influencers</CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="text-gray-400" />
          <Input
            type="text"
            placeholder="Search influencers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Influencer ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Last Submission</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.map((participant) => (
              <TableRow key={participant._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400" />
                    <span>{participant.influencerId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={participant.status === "completed" ? "destructive" : "default"}>
                    {participant.status}
                  </Badge>
                </TableCell>
                <TableCell>{getSubmissionCount(participant.influencerId)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400" />
                    <span>{getLastSubmissionDate(participant.influencerId)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleViewSubmissions(participant.influencerId)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Submissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

