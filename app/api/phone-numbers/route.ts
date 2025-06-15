import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import { PhoneNumber } from "@/models/PhoneNumber";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if phone number already exists
    const existingPhone = await PhoneNumber.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 400 }
      );
    }

    // Create new phone number entry
    const phoneNumber = await PhoneNumber.create({ phone });

    return NextResponse.json(
      { message: "Phone number registered successfully", phoneNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving phone number:", error);
    return NextResponse.json(
      { error: "Error saving phone number" },
      { status: 500 }
    );
  }
}
