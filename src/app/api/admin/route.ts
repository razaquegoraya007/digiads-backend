import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../libs/models/users.model";

export const GET = async (req: NextRequest, res: NextResponse) => {
  return NextResponse.json({ error: "Empty Route" }, { status: 200 });
};
