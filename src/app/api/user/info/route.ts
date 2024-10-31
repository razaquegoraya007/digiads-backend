import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../libs/models/users.model";
import { dbConnect } from "../../../../libs/services/mongoose";
import { corsHeaders } from "../../_utils";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  await dbConnect();
  // Retrieve x-user-id header from the request
  const user_id = req.headers.get("x-user-id");

  console.log("USER ID FOR USER", user_id);

  const user = await User.findById(user_id);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }
  return NextResponse.json(
    {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        accountType: user.accountType,
      },
    },
    {
      headers: corsHeaders,
    }
  );
};
