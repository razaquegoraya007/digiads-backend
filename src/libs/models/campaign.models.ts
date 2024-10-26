import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    video_url: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejection_reason: { type: String },
  },
  {
    timestamps: true,
  }
);

const Campaign =
  mongoose.models?.Campaign || mongoose.model("Campaign", campaignSchema);
export default Campaign;
