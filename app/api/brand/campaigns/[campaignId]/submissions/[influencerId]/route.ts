import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { campaignId: string; influencerId: string } }) {
    try {
      const { campaignId, influencerId } = await params
  
      if (!campaignId || !influencerId) {
        return NextResponse.json({ error: "Missing campaign ID or influencer ID" }, { status: 400 })
      }
  
      const client = await clientPromise
      const db = client.db("acyber_challenge")
  
      // Fetch submissions for the specific campaign and influencer
      const submissions = await db
        .collection("submissions")
        .find({
          campaignId: new ObjectId(campaignId),
          influencerId: new ObjectId(influencerId),
        })
        .toArray()
  
      return NextResponse.json({ submissions }, { status: 200 })
    } catch (error) {
      console.error("Error fetching submissions:", error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
  }