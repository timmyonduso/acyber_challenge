import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function GET(req: NextRequest, { params }: { params: { campaignId: string } }) {
    try {
    const { campaignId } = await params;

    if (!campaignId) {
        return NextResponse.json({ error: "Missing campaign ID" }, { status: 400 });
      }
      
    const client = await clientPromise;
    const db = client.db("acyber_challenge");

    // Fetch influencers participating in the campaign
    const participants = await db.collection("campaignParticipants")
      .find({ campaignId: new ObjectId(campaignId) })
      .toArray();

    const influencerIds = participants.map((p) => p.influencerId);

    // Fetch submissions for the campaign
    const submissions = await db.collection("submissions")
      .find({ campaignId: new ObjectId(campaignId), influencerId: { $in: influencerIds } })
      .toArray();

    return NextResponse.json({ participants, submissions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaign participants:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
