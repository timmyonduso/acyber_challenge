import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ParticipantsList } from "@/components/campaigns/ParticipantsList"
import { PageHeader } from "@/components/ui/PageHeader"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

async function getCampaignParticipants(campaignId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brand/campaigns/${campaignId}/participants`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error("Failed to fetch campaign participants")
  }
  return res.json()
}

export async function generateMetadata({ params }: { params: { campaignId: string } }) {
  const { campaignId } = await params;
  return {
    title: `Campaign Participants - ${campaignId}`,
  }
}

export default async function CampaignParticipantsPage({
  params,
}: {
  params: { campaignId: string }
}) {
  const { campaignId } = await params;

  let campaignData: { participants: any[]; submissions: any[] }

  try {
    campaignData = await getCampaignParticipants(campaignId)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Campaign Participants"
        description="View all influencers participating in this campaign and their submissions."
      />
      <Suspense fallback={<LoadingSpinner />}>
        <ParticipantsList campaignId={campaignId} participants={campaignData.participants} submissions={campaignData.submissions} />
      </Suspense>
    </div>
  )
}

