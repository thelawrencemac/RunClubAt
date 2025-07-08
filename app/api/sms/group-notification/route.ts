import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { sendGroupNotification } from "@/libs/twilio";
import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";
import Group from "@/models/Group";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupName, message } = await request.json();

    // Validate input
    if (!groupName || !message) {
      return NextResponse.json(
        { error: "Missing required fields: groupName, message" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify user owns this group
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.groupNames?.includes(groupName)) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to send notifications for this group",
        },
        { status: 403 }
      );
    }

    // Get group details and member phone numbers
    const group = await Group.findOne({ groupName: groupName });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Extract phone numbers from members
    const memberPhoneNumbers =
      group.members?.map(
        (member: { phoneNumber: string }) => member.phoneNumber
      ) || [];

    if (memberPhoneNumbers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No members to notify",
        total: 0,
        successful: 0,
        failed: 0,
      });
    }

    // Send group notification
    const result = await sendGroupNotification(
      groupName,
      memberPhoneNumbers,
      message
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Group notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
