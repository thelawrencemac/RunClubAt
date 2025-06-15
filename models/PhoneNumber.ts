import mongoose from "mongoose";

const phoneNumberSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating a new model if it already exists
export const PhoneNumber =
  mongoose.models.PhoneNumber ||
  mongoose.model("PhoneNumber", phoneNumberSchema);
