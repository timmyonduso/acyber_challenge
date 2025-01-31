import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo"

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("acyber_challenge");

    const { searchParams } = new URL(req.url);
    const influencerId = searchParams.get("influencerId");
    const campaignId = searchParams.get("id");

    if (campaignId) {
      // Fetch single campaign by ID
      const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(campaignId) });

      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }

      return NextResponse.json({ campaigns: [campaign] }, { status: 200 });
    }

    if (!influencerId) {
      return NextResponse.json({ error: "Missing influencer ID" }, { status: 400 });
    }

    // Fetch campaigns joined by influencer
    const campaigns = await db.collection("campaignParticipants")
      .find({ influencerId: new ObjectId(influencerId) })
      .toArray();

    const campaignIds = campaigns.map((c) => c.campaignId);
    const campaignData = await db.collection("campaigns")
      .find({ _id: { $in: campaignIds } })
      .toArray();

    return NextResponse.json({ campaigns: campaignData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, instructions, deadline } = body;

    if (!title || !description || !instructions || !deadline) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("acyber_challenge");
    const campaignsCollection = db.collection("campaigns");

    const newCampaign = {
      title,
      description,
      instructions,
      deadline: new Date(deadline),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await campaignsCollection.insertOne(newCampaign);

    return NextResponse.json({ success: true, campaign: { ...newCampaign, _id: result.insertedId } }, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}