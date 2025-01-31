'use client'

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, CheckCircle2, XCircle, Clock, Instagram, Youtube, Twitter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type Definitions
interface CampaignManagementProps {
  campaignId: string;
}

interface Participant {
  _id: string;
  name: string;
  username: string;
  avatarUrl: string;
  platform: 'instagram' | 'youtube' | 'twitter';
  joinDate: string;
  postCount: number;
  status: SubmissionStatus;
}

interface Submission {
  _id: string;
  influencerName: string;
  influencerAvatar: string;
  contentUrl: string;
  caption: string;
  submittedAt: string;
  status: SubmissionStatus;
}

type SubmissionStatus = 'pending' | 'approved' | 'rejected';

type StatusStyles = {
  [key in SubmissionStatus]: string;
};

type SocialIcons = {
  [key in Lowercase<Participant['platform']>]: JSX.Element;
};

const CampaignManagement: React.FC<CampaignManagementProps> = ({ campaignId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/participants`);
        const data = await response.json();
        setParticipants(data.participants);
        setSubmissions(data.submissions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId]);

  const handleSubmissionStatus = async (submissionId: string, status: SubmissionStatus) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        setSubmissions(submissions.map(sub => 
          sub._id === submissionId ? { ...sub, status } : sub
        ));
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    const statusStyles: StatusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return (
      <Badge className={statusStyles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSocialIcon = (platform: Participant['platform']) => {
    const icons: SocialIcons = {
      instagram: <Instagram className="h-4 w-4" />,
      youtube: <Youtube className="h-4 w-4" />,
      twitter: <Twitter className="h-4 w-4" />
    };
    return icons[platform.toLowerCase() as Lowercase<Participant['platform']>] || null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="participants" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Submissions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant._id}>
                        <TableCell className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={participant.avatarUrl} alt={participant.name} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-sm text-gray-500">@{participant.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSocialIcon(participant.platform)}
                            {participant.platform}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(participant.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>{participant.postCount}</TableCell>
                        <TableCell>{getStatusBadge(participant.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Content Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {submissions.map((submission) => (
                    <Card key={submission._id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={submission.contentUrl} 
                          alt={`Submission by ${submission.influencerName}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={submission.influencerAvatar} alt={submission.influencerName} />
                            <AvatarFallback>{submission.influencerName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{submission.influencerName}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">{submission.caption}</p>
                          {submission.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleSubmissionStatus(submission._id, 'approved')}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button 
                                onClick={() => handleSubmissionStatus(submission._id, 'rejected')}
                                variant="destructive" 
                                className="flex-1"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              {getStatusBadge(submission.status)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignManagement;