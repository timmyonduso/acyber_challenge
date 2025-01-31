import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    const { campaignId, influencerId } = await req.json();

    if (!campaignId || !influencerId) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("acyber_challenge");
    const campaignParticipants = db.collection("campaignParticipants");

    // Check if participant already exists
    const existingParticipant = await campaignParticipants.findOne({
      campaignId: new ObjectId(campaignId),
      influencerId: new ObjectId(influencerId),
    });

    if (existingParticipant) {
      return NextResponse.json({ message: "You have already joined this campaign." }, { status: 400 });
    }

    // Insert new participant
    await campaignParticipants.insertOne({
      campaignId: new ObjectId(campaignId),
      influencerId: new ObjectId(influencerId),
      status: "joined",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Successfully joined the campaign!" }, { status: 201 });
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
