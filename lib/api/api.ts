export async function fetchCampaignParticipants(campaignId: string) {
    try {
      const res = await fetch(`/api/brand/campaigns/${campaignId}`);
      if (!res.ok) throw new Error("Failed to fetch campaign participants");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { participants: [], submissions: [] };
    }
  }
  