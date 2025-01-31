import React from 'react';
import { useRouter } from 'next/navigation';
import {  CheckCircle, Clock, AlertCircle, LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/models/campaign';

interface StatusConfig {
  icon: LucideIcon;
  text: string;
  color: string;
}

// Campaign Details Page Component
export default function CampaignDetailsPage () {
    const [campaign, setCampaign] = React.useState<Campaign | null>(null);
    const [contentUrl, setContentUrl] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const router = useRouter();
  
    const handleSubmission = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!campaign?._id) return;
      
      setSubmitting(true);
      // Submit content URL to the API
      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaignId: campaign._id.toString(),
            influencerId: '65b24c7c5f8d1a1234567891', // Replace with actual influencer ID
            contentUrl,
          }),
        });
  
        if (!response.ok) throw new Error('Submission failed');
  
        // Show success message and reset form
        setContentUrl('');
        // Add success toast here
      } catch (error) {
        console.error('Error submitting content:', error);
        // Add error toast here
      } finally {
        setSubmitting(false);
      }
    };
  
    const getDeadlineStatus = (): StatusConfig | null => {
      if (!campaign) return null;
      const deadline = new Date(campaign.deadline);
      const now = new Date();
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
      if (daysLeft < 0) return { icon: AlertCircle, text: 'Deadline passed', color: 'text-red-500' };
      if (daysLeft <= 3) return { icon: Clock, text: `${daysLeft} days left`, color: 'text-yellow-500' };
      return { icon: CheckCircle, text: `${daysLeft} days left`, color: 'text-green-500' };
    };
  
    const status = getDeadlineStatus();
  
    if (!campaign) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Back to Campaigns
        </Button>
  
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{campaign.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {status && (
                    <>
                      <status.icon className={`w-4 h-4 ${status.color}`} />
                      <span className={status.color}>{status.text}</span>
                    </>
                  )}
                </CardDescription>
              </div>
              <Badge variant="outline" className={campaign.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}>
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="mb-6">{campaign.description}</p>
              
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <p className="mb-6">{campaign.instructions}</p>
  
              <form onSubmit={handleSubmission} className="space-y-4">
                <div>
                  <label htmlFor="contentUrl" className="block text-sm font-medium mb-2">
                    Content URL
                  </label>
                  <input
                    type="url"
                    id="contentUrl"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="Enter your content URL here"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? 'Submitting...' : 'Submit Content'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };


// 'use client';

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Loader } from "lucide-react";
// import Link from "next/link";

// interface CampaignDetail {
//   id: string;
//   title: string;
//   description: string;
//   instructions: string;
//   deadline: string;
//   status: string;
//   submission?: {
//     contentUrl: string;
//     status: string;
//     metrics?: {
//       likes: number;
//       shares: number;
//     };
//   };
// }

// export default function CampaignDetailsPage() {
//   const { id } = useParams();
//   const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchCampaignDetails() {
//       try {
//         const res = await fetch(`/api/campaigns/${id}`);
//         const data = await res.json();
//         setCampaign(data);
//       } catch (error) {
//         console.error("Error fetching campaign details:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) fetchCampaignDetails();
//   }, [id]);

//   if (loading) return <Loader className="animate-spin mx-auto mt-10" size={32} />;
//   if (!campaign) return <p className="text-center mt-10 text-red-500">Campaign not found.</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>{campaign.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-700">{campaign.description}</p>
//           <p className="mt-2"><strong>Instructions:</strong> {campaign.instructions}</p>
//           <p className="mt-2"><strong>Deadline:</strong> {new Date(campaign.deadline).toLocaleDateString()}</p>
//           <p className="mt-2"><strong>Status:</strong> {campaign.status}</p>

//           {campaign.submission && (
//             <div className="mt-4">
//               <h2 className="text-lg font-semibold">Your Submission</h2>
//               <p><strong>Content URL:</strong> <a href={campaign.submission.contentUrl} className="text-blue-500 underline" target="_blank">{campaign.submission.contentUrl}</a></p>
//               <p><strong>Submission Status:</strong> {campaign.submission.status}</p>
//               {campaign.submission.metrics && (
//                 <p><strong>Engagement:</strong> {campaign.submission.metrics.likes} Likes, {campaign.submission.metrics.shares} Shares</p>
//               )}
//             </div>
//           )}

//           <div className="mt-4">
//             <Link href="/campaigns">
//               <Button variant="outline">Go Back</Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
