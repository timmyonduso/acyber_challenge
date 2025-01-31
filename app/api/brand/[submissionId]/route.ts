import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function PATCH(req: NextRequest, { params }: { params: { submissionId: string } }) {
  try {
    const { submissionId } = params;

    if (!submissionId) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    const { status } = await req.json();

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("acyber_challenge");

    // Update the submission status
    const result = await db.collection("submissions").updateOne(
      { _id: new ObjectId(submissionId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Submission ${status}` }, { status: 200 });
  } catch (error) {
    console.error("Error updating submission status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
