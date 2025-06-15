import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const data = await req.json();
  const { groupName, adminId } = data;
  if (!groupName || !adminId) {
    return NextResponse.json(
      { error: "Missing groupName or adminId" },
      { status: 400 }
    );
  }
  // Check if group already exists
  const existing = await Group.findOne({ groupName });
  if (existing) {
    return NextResponse.json(
      { error: "Group name already taken" },
      { status: 409 }
    );
  }
  // Create group
  const group = await Group.create({ ...data, adminId });
  // Update user
  await User.findByIdAndUpdate(adminId, { groupName });
  return NextResponse.json(group);
}
