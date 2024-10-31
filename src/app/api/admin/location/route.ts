// pages/api/location/add.js

import { NextResponse } from "next/server";
import { dbConnect } from "../../../../libs/services/mongoose";
import Location from "../../../../libs/models/location.models";

export const POST = async (req) => {
  await dbConnect(); // connect to MongoDB

  try {
    const {
      identifier,
      description,
      latitude,
      longitude,
      address,
      size,
      status,
    } = await req.json();

    if (!identifier || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const newLocation = new Location({
      identifier,
      description,
      latitude,
      longitude,
      address,
      size,
      status,
    });
    await newLocation.save();

    return NextResponse.json({ message: "Location added successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = async () => {
  await dbConnect();

  try {
    const locations = await Location.find({});
    console.log(locations);

    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
