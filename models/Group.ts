import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    timeAndDate: {
      type: String,
    },
    packLead1: {
      type: String,
    },
    packLead2: {
      type: String,
    },
    stravaLink: {
      type: String,
    },
    startLocation: {
      type: String,
    },
    slogan: {
      type: String,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        phoneNumber: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          default: "",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

groupSchema.plugin(toJSON);

export default mongoose.models.Group || mongoose.model("Group", groupSchema);
