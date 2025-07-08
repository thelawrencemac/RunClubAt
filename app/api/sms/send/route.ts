import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { sendSMS, formatPhoneNumber } from "@/libs/twilio";
import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, body, groupName } = await request.json();

    // Validate input
    if (!to || !body) {
      return NextResponse.json(
        { error: "Missing required fields: to, body" },
        { status: 400 }
      );
    }

    // If groupName is provided, verify user owns this group
    if (groupName) {
      await connectToDatabase();
      const user = await User.findOne({ email: session.user.email });

      if (!user || !user.groupNames?.includes(groupName)) {
        return NextResponse.json(
          { error: "You do not have permission to send SMS for this group" },
          { status: 403 }
        );
      }
    }

    // Send SMS
    const result = await sendSMS({
      to: formatPhoneNumber(to),
      body: groupName ? `[${groupName}] ${body}` : body,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("SMS send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
