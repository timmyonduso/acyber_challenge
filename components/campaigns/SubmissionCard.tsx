import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon, FileImageIcon } from "lucide-react";

interface SubmissionCardProps {
  contentUrl: string;
  influencerName: string;
  submittedAt: string;
  status: string;
  onApprove: () => void;
  onReject: () => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ contentUrl, influencerName, submittedAt, status, onApprove, onReject }) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileImageIcon className="w-5 h-5 text-blue-600" />
          <span>{influencerName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Submitted: {new Date(submittedAt).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Status: <span className={`text-${status === 'pending' ? 'yellow' : status === 'approved' ? 'green' : 'red'}-500`}>{status}</span></p>
        <a href={contentUrl} target="_blank" className="text-blue-500 underline text-sm">View Content</a>
        <div className="mt-4 flex space-x-4">
          <Button onClick={onApprove} className="bg-green-500 hover:bg-green-600 text-white">
            <CheckIcon className="w-4 h-4 mr-1" /> Approve
          </Button>
          <Button onClick={onReject} className="bg-red-500 hover:bg-red-600 text-white">
            <XIcon className="w-4 h-4 mr-1" /> Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
