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
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Influencers</CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="text-gray-400" />
          <Input
            type="text"
            placeholder="Search influencers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table className="bg-gray-800">
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Influencer ID</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Submissions</TableHead>
              <TableHead className="text-gray-400">Last Submission</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.map((participant) => (
              <TableRow key={participant._id} className="bg-gray-700">
                <TableCell className="font-medium text-gray-300">
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400" />
                    <span>{participant.influencerId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={participant.status === "completed" ? "destructive" : "default"}
                    className={participant.status === "completed" ? "bg-red-600" : "bg-gray-600"}
                  >
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSubmissions(participant.influencerId)}
                    className="text-gray-700 border-gray-500 hover:bg-gray-600"
                  >
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

