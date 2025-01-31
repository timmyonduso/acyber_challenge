import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("acyber_challenge")

    const { campaignId, influencerId, contentUrl } = await req.json();

    if (!campaignId || !influencerId || !contentUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = {
      campaignId: new ObjectId(campaignId),
      influencerId: new ObjectId(influencerId),
      contentUrl,
      status: "pending",
      metrics: { likes: 0, shares: 0 },
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("submissions").insertOne(submission);

    return NextResponse.json({ message: "Submission received", submissionId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error submitting content:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
