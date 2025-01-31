import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/PageHeader"
import { SubmissionsList } from "@/components/campaigns/SubmissionsList"

async function getInfluencerSubmissions(campaignId: string, influencerId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/brand/campaigns/${campaignId}/submissions/${influencerId}`,
    { cache: "no-store" },
  )
  if (!res.ok) {
    throw new Error("Failed to fetch influencer submissions")
  }
  return res.json()
}

export default async function InfluencerSubmissionsPage({
  params,
}: {
  params: { campaignId: string; influencerId: string }
}) {
  const { campaignId, influencerId } = await params
  let submissionsData: { submissions: any[] }

  try {
    submissionsData = await getInfluencerSubmissions(campaignId, influencerId)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Influencer Submissions"
        description={`Review and manage submissions for Influencer ${influencerId}`}
      />
      <SubmissionsList submissions={submissionsData.submissions} campaignId={campaignId} influencerId={influencerId} />
    </div>
  )
}

