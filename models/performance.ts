import { ObjectId } from "mongodb";

// 📊 Performance Metrics Model (Tracks influencer performance)
export interface PerformanceMetrics {
    _id?: ObjectId;
    influencerId: ObjectId;
    campaignId: ObjectId;
    totalSubmissions: number;
    submissionDates: string[];
    engagement: {
      totalLikes: number;
      totalShares: number;
    };
    createdAt: Date;
    updatedAt: Date;
  }
  