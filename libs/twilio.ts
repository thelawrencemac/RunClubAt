import twilio from "twilio";

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
  throw new Error("Missing Twilio environment variables");
}

const client = twilio(accountSid, authToken);

export interface SMSMessage {
  to: string;
  body: string;
}

export const sendSMS = async ({ to, body }: SMSMessage) => {
  try {
    const message = await client.messages.create({
      body,
      from: phoneNumber,
      to: formatPhoneNumber(to),
    });

    console.log("SMS sent successfully:", message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Format phone number to E.164 format (required by Twilio)
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // If it's a 10-digit US number, add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  // If it already has country code, add +
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }

  // If it already has +, return as is
  if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }

  // Default: assume US number and add +1
  return `+1${cleaned}`;
};

// Send group notification to all members
export const sendGroupNotification = async (
  groupName: string,
  phoneNumbers: string[],
  message: string
) => {
  const results = await Promise.allSettled(
    phoneNumbers.map((phone) =>
      sendSMS({
        to: phone,
        body: `[${groupName}] ${message}`,
      })
    )
  );

  const successful = results.filter(
    (result) => result.status === "fulfilled" && result.value.success
  ).length;

  const failed = results.length - successful;

  return {
    total: results.length,
    successful,
    failed,
    results: results.map((result, index) => ({
      phone: phoneNumbers[index],
      success: result.status === "fulfilled" && result.value.success,
      error:
        result.status === "rejected" ? "Failed to send" : result.value.error,
    })),
  };
};

export default client;
