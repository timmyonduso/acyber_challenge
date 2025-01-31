// app/api/campaigns/[campaignId]/participants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function GET(
  req: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const campaignId = params.campaignId;

    if (!campaignId || !ObjectId.isValid(campaignId)) {
      return NextResponse.json(
        { error: "Invalid or missing campaign ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("acyber_challenge");

    // Fetch influencers participating in the campaign
    const participants = await db
      .collection("campaignParticipants")
      .aggregate([
        {
          $match: { campaignId: new ObjectId(campaignId) }
        },
        {
          $lookup: {
            from: "influencers",
            localField: "influencerId",
            foreignField: "_id",
            as: "influencer"
          }
        },
        {
          $unwind: "$influencer"
        },
        {
          $project: {
            _id: 1,
            name: "$influencer.name",
            username: "$influencer.username",
            avatarUrl: "$influencer.avatarUrl",
            platform: "$influencer.platform",
            joinDate: "$createdAt",
            postCount: { $ifNull: ["$postCount", 0] },
            status: 1
          }
        }
      ])
      .toArray();

    // Fetch submissions for the campaign
    const submissions = await db
      .collection("submissions")
      .aggregate([
        {
          $match: { campaignId: new ObjectId(campaignId) }
        },
        {
          $lookup: {
            from: "influencers",
            localField: "influencerId",
            foreignField: "_id",
            as: "influencer"
          }
        },
        {
          $unwind: "$influencer"
        },
        {
          $project: {
            _id: 1,
            influencerName: "$influencer.name",
            influencerAvatar: "$influencer.avatarUrl",
            contentUrl: 1,
            caption: 1,
            submittedAt: "$createdAt",
            status: { $ifNull: ["$status", "pending"] }
          }
        }
      ])
      .toArray();

    return NextResponse.json({ participants, submissions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaign participants:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}