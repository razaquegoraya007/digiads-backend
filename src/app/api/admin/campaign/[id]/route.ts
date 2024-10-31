import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../libs/services/mongoose";
import Campaign from "../../../../../libs/models/campaign.models";

export const PUT = async (req: NextRequest, context: any) => {
  await dbConnect();
  const params = context.params;
  const { id } = params;
  console.log("[CONTEXT]");
  const { status, rejection_reason } = await req.json();

  try {
    const update = { status };

    const updatedCampaign = await Campaign.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).populate("user location");

    if (!updatedCampaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCampaign });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
};
