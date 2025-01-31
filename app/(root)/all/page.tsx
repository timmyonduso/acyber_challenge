"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Users } from "lucide-react"

interface Campaign {
  _id: string
  title: string
  description: string
  deadline: string
  status: string
}

export default function AllCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchAllCampaigns() {
      try {
        const res = await fetch("/api/all")
        const data = await res.json()
        setCampaigns(data.campaigns || [])
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllCampaigns()
  }, [])

  const handleJoinCampaign = async (campaignId: string) => {
    setJoining(campaignId)
    try {
      const influencerId = "65b24c7c5f8d1a1234567891" // Replace with actual influencer ID
      const res = await fetch("/api/influencer/campaigns/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, influencerId }),
      })

      if (res.ok) {
        alert("Successfully joined the campaign!")
      } else {
        const errorData = await res.json()
        alert(errorData.message || "Failed to join the campaign.")
      }
    } catch (error) {
      console.error("Error joining campaign:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setJoining(null)
    }
  }

  const handleViewParticipants = (campaignId: string) => {
    router.push(`/brand/campaigns/${campaignId}/participants`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">All Campaigns</h1>
      {loading ? (
        <p className="text-gray-400">Loading campaigns...</p>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <Card
              key={campaign._id}
              className="bg-gray-900 border border-gray-800 text-white hover:shadow-lg hover:shadow-gray-700 transition"
            >
              <CardContent className="p-4">
                <CardTitle className="flex justify-between text-gray-200">
                  {campaign.title}
                  <span
                    className={`px-2 py-1 text-sm rounded-md ${
                      campaign.status === "active"
                        ? "bg-green-600 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </CardTitle>
                <CardDescription className="mt-2 text-gray-400">
                  {campaign.description}
                </CardDescription>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Deadline:{" "}
                  <span className="text-gray-300">
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleJoinCampaign(campaign._id)}
                    disabled={joining === campaign._id}
                  >
                    {joining === campaign._id ? (
                      <>
                        <CheckCircle className="w-4 h-4 animate-spin mr-2 text-white" />
                        Joining...
                      </>
                    ) : (
                      "Join Campaign"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-800 hover:bg-gray-800"
                    onClick={() => handleViewParticipants(campaign._id)}
                  >
                    <Users className="w-4 h-4 mr-2 text-gray-800 hover:text-gray-300" />
                    View Participants
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No campaigns available.</p>
      )}
    </div>
  );
  
}

