import { NextResponse } from "next/server";
import Location from "../../../../libs/models/location.models";
import { dbConnect } from "../../../../libs/services/mongoose";
import { corsHeaders } from "../../_utils";

export const GET = async () => {
  await dbConnect();

  try {
    const locations = await Location.find({});
    console.log(locations);

    return NextResponse.json(locations, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
