"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ListChecks } from "lucide-react";
import Link from "next/link";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const influencerId = "65b24c7c5f8d1a1234567891"; // Replace with actual influencer ID
        const res = await fetch(`/api/influencer/campaigns?influencerId=${influencerId}`);
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">My Campaigns</h1>
      {loading ? (
        <Skeleton className="h-20 w-full rounded-lg" />
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="bg-gray-800 hover:shadow-lg transition rounded-lg">
              <CardContent className="p-4">
                <CardTitle className="flex justify-between text-white">
                  {campaign.title}
                  <span
                    className={`px-2 py-1 text-sm rounded-md ${
                      campaign.status === "active" ? "bg-green-600 text-white" : "bg-gray-500 text-white"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </CardTitle>
                <CardDescription className="mt-2 text-gray-400">{campaign.description}</CardDescription>
                <div className="mt-4 flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                </div>
                <div className="mt-4">
                  <Link href={`/influencer/campaigns/${campaign._id}`}>
                    <Button variant="outline" className="text-gray-700 border-gray-600 hover:bg-gray-700">
                      <ListChecks className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No campaigns found.</p>
      )}
    </div>
  );  
}
