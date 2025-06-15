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
      required: true,
    },
    packLead1: {
      type: String,
      required: true,
    },
    packLead2: {
      type: String,
    },
    stravaLink: {
      type: String,
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    slogan: {
      type: String,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

groupSchema.plugin(toJSON);

export default mongoose.models.Group || mongoose.model("Group", groupSchema);
