import { ObjectId } from "mongodb";

// 🎥 Submission Model
export interface Submission {
  _id?: ObjectId;
  campaignId: ObjectId;
  influencerId: ObjectId;
  contentUrl: string; // TikTok/social media post URL
  status: "pending" | "approved" | "rejected";
  metrics?: {
    likes: number;
    shares: number;
  };
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
