import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../libs/services/mongoose";
import Location from "../../../../../libs/models/location.models";

export const POST = async (req) => {
  await dbConnect();

  try {
    const { id, status } = await req.json();

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({
      message: "Status updated successfully",
      updatedLocation,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
