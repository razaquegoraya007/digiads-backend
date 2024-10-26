import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    identifier: { type: String, required: true, unique: true },
    description: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
    size: { type: String },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Location =
  mongoose.models?.Location || mongoose.model("Location", locationSchema);
export default Location;
