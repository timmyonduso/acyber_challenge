// api/campaigns/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("acyber_challenge");

    const campaigns = await db.collection("campaigns").find().toArray();

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all campaigns:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
