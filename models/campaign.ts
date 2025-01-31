import { ObjectId } from "mongodb";

// 📢 Campaign Model
export interface Campaign {
  _id?: ObjectId;
  title: string;
  description: string;
  instructions: string;
  deadline: Date;
  status: "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

// 👥 Campaign Participant Model (Tracks influencer participation)
export interface CampaignParticipant {
  _id?: ObjectId;
  campaignId: ObjectId;
  influencerId: ObjectId;
  status: "joined" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

// ✅ API Response Types

// - Campaign List Item (Used in frontend lists)
export interface CampaignListItem {
  id: string;
  title: string;
  status: string;
  deadline: string;
  submissionStatus: "not_submitted" | "pending" | "approved" | "rejected";
}

// - Campaign Detail (Used for single campaign pages)
export interface CampaignDetail {
  id: string;
  title: string;
  description: string;
  instructions: string;
  deadline: string;
  status: string;
  submission?: {
    contentUrl: string;
    status: string;
    metrics?: {
      likes: number;
      shares: number;
    };
  };
}
