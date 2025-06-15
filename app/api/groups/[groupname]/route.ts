import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Group from "@/models/Group";

export async function GET(
  req: NextRequest,
  { params }: { params: { groupname: string } }
) {
  await connectToDatabase();
  const group = await Group.findOne({ groupName: params.groupname });
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }
  return NextResponse.json(group);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { groupname: string } }
) {
  await connectToDatabase();
  const data = await req.json();
  // TODO: Replace with real user auth
  const adminId = data.adminId || "000000000000000000000000";
  const group = await Group.findOneAndUpdate(
    { groupName: params.groupname },
    { ...data, groupName: params.groupname, adminId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return NextResponse.json(group);
}
