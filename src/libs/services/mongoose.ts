import * as mongoose from "mongoose";

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not defined");
  await mongoose.connect(process.env.MONGODB_URI);
};
