// src/app/api/campaigns/route.ts

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../libs/services/mongoose";
import Campaign from "../../../../libs/models/campaign.models";

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const campaigns = await Campaign.find().populate("user location");
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
