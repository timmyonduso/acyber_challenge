"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Upload } from "lucide-react";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  instructions: string;
  deadline: string;
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentUrl, setContentUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const res = await fetch(`/api/influencer/campaigns?id=${id}`);
        const data = await res.json();
        setCampaign(data.campaigns?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCampaign();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const influencerId = "65b24c7c5f8d1a1234567891"; // Replace with actual influencer ID
      const res = await fetch("/api/influencer/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: id, influencerId, contentUrl }),
      });
      if (res.ok) {
        alert("Submission successful!");
        setContentUrl("");
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return campaign ? (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white">
      <Card className="bg-gray-800">
        <CardContent className="p-6">
          <CardTitle>{campaign.title}</CardTitle>
          <CardDescription className="mt-2 text-gray-400">{campaign.description}</CardDescription>
          <div className="mt-4">
            <p className="font-semibold">Instructions:</p>
            <p className="text-gray-300">{campaign.instructions}</p>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Deadline:</p>
            <p className="text-red-500">{new Date(campaign.deadline).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
  
      {/* Submission Form */}
      <div className="mt-6 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-bold text-white">Submit Your Content</h2>
        <Input
          type="url"
          placeholder="Enter content URL (TikTok, Instagram, etc.)"
          value={contentUrl}
          onChange={(e) => setContentUrl(e.target.value)}
          className="mt-2 bg-gray-700 text-white placeholder-gray-400"
        />
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleSubmit}
          disabled={submitting || !contentUrl}
        >
          {submitting ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
          {submitting ? "Submitting..." : "Submit Content"}
        </Button>
      </div>
    </div>
  ) : (
    <p className="text-gray-500">Campaign not found.</p>
  );
}  