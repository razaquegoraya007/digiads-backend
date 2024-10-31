import { v2 as cloudinary } from "cloudinary";
import Campaign from "../../../../libs/models/campaign.models";
import { dbConnect } from "../../../../libs/services/mongoose";
import multer from "multer";
import { Readable } from "stream";
import { File } from "buffer";
import { NextResponse } from "next/server";
import { corsHeaders } from "../../_utils";
import Location from "../../../../libs/models/location.models";

cloudinary.config({
  cloud_name: "dfagbsowj",
  api_key: "931131763822351",
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const POST = async (req) => {
  try {
    await dbConnect();
    const formData = await req.formData(); // Get form data from request

    const user_id = req.headers.get("x-user-id");

    // Extract fields from form data
    const name = formData.get("name");
    const description = formData.get("description");
    const location = formData.get("location");
    const videoFile = formData.get("file") as File;

    const buffer: Buffer = Buffer.from(await videoFile.arrayBuffer());

    console.log("[NAME]", name);
    console.log("[DESCRIPTION]", description);
    console.log("[FILE]", videoFile);
    console.log("[LOCATION]", location);

    const alreadyOccupied = await Location.findById(location);
    if (alreadyOccupied.status == "booked") {
      return NextResponse.json(
        {
          message: "Location already occupied",
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    let videoURL = "";

    try {
      const base64Image: string = `data:${
        videoFile.type
      };base64,${buffer.toString("base64")}`;
      console.log(`The file: ${videoURL} is uploading...`);
      const response = await cloudinary.uploader.upload(base64Image, {
        resource_type: "video",
      });
      videoURL = response.secure_url;
    } catch (error: any) {
      console.error(error);
    }

    console.log("[VIDEO_URL]", videoURL);

    // Create new campaign instance
    const newCampaign = new Campaign({
      name,
      description,
      location,
      video_url: videoURL, // Save the secure URL from Cloudinary
      user: user_id, // Assuming you have user ID from authentication
      category: "default", // Set a default category or pass it from frontend if needed
    });

    // Save to database
    await newCampaign.save();

    const selectedLocation = await Location.findById(location);
    selectedLocation.status = "booked";
    await selectedLocation.save();

    return NextResponse.json(
      { success: true, campaign: newCampaign },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};
