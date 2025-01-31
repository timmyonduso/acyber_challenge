import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function GET(req: Request) {
  try {
    const client = await clientPromise
    const db = client.db("acyber_challenge")

    // Get influencer ID from query params
    const { searchParams } = new URL(req.url);
    const influencerId = searchParams.get("influencerId");

    if (!influencerId) {
      return NextResponse.json({ error: "Missing influencer ID" }, { status: 400 });
    }

    // Fetch influencer's submissions
    const submissions = await db.collection("submissions")
      .find({ influencerId: new ObjectId(influencerId) })
      .toArray();

    const totalSubmissions = submissions.length;
    const submissionDates = submissions.map(s => s.submittedAt.toISOString());

    const totalLikes = submissions.reduce((sum, s) => sum + (s.metrics?.likes || 0), 0);
    const totalShares = submissions.reduce((sum, s) => sum + (s.metrics?.shares || 0), 0);

    const performanceMetrics = {
      totalSubmissions,
      submissionDates,
      engagement: {
        totalLikes,
        totalShares,
      },
    };

    return NextResponse.json(performanceMetrics, { status: 200 });
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
