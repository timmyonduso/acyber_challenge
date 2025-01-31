import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  UsersIcon, CheckSquareIcon, FanIcon } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Campaign Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task 1: Create Campaign */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FanIcon className="w-6 h-6 text-blue-600" />
              <span>Task 1: Create Campaign</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Create a new campaign and manage its details.</p>
            <Link href="/all">
              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                View all campaigns
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Task 2: Influencer List */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UsersIcon className="w-6 h-6 text-green-600" />
              <span>Task 2: Influencer List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">View all influencers participating in campaigns.</p>
            {/* /campaigns/[campaignId]/participants */}
            <Link href="">
              <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                View Participants
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Task 2: Submission Approvals */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckSquareIcon className="w-6 h-6 text-red-600" />
              <span>Task 2: Submission Approvals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Approve or reject influencer submissions.</p>
            {/* /campaigns/[campaignId]/submissions */}
            <Link href="">
              <button className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                Manage Submissions
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
