'use client';

import SubmissionCard from "@/components/campaigns/SubmissionCard";
import { useEffect, useState } from "react";

interface Submission {
    _id: string;
    contentUrl: string;
    influencerName: string;
    submittedAt: string;
    status: string;
  }
  
const SubmissionApprovalPage = ({ params }: { params: { campaignId: string } }) => {

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await fetch(`/api/campaigns/679b6b4ca5b9a8102cf40d5f/participants`);
      const data = await response.json();
      setSubmissions(data.submissions || []);
    };
    fetchSubmissions();
  }, [params.campaignId]);

  const handleApprove = async (submissionId: string) => {
    await fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved" }),
      headers: { "Content-Type": "application/json" },
    });
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission._id === submissionId ? { ...submission, status: "approved" } : submission
      )
    );
  };

  const handleReject = async (submissionId: string) => {
    await fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected" }),
      headers: { "Content-Type": "application/json" },
    });
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission._id === submissionId ? { ...submission, status: "rejected" } : submission
      )
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Submission Approvals</h1>
      {submissions.map((submission: any) => (
        <SubmissionCard
          key={submission._id}
          contentUrl={submission.contentUrl}
          influencerName={submission.influencerName || "Unknown"}
          submittedAt={submission.submittedAt}
          status={submission.status}
          onApprove={() => handleApprove(submission._id)}
          onReject={() => handleReject(submission._id)}
        />
      ))}
    </div>
  );
};

export default SubmissionApprovalPage;
