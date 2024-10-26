import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken } from "../../../../libs/authUtils";

export const POST = async (req: NextRequest) => {
  const { password, username } = await req.json();

  if (!password) {
    return NextResponse.json(
      { error: "Please provide all missing fields." },
      { status: 403 }
    );
  }

  if (
    process.env.ADMIN_PASSWORD === password &&
    process.env.ADMIN_USERNAME === username
  ) {
    const token = await generateAdminToken({ id: "", isAdmin: false });

    const response = NextResponse.json({
      message: "Admin Login Successfully.",
    });
    response.headers.set(
      "Set-Cookie",
      `user-token=${token}; HttpOnly; Path=/; Max-Age=${12 * 60 * 60};`
    );

    return response;
  }

  return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
};
