import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken } from "../../../../libs/authUtils";

export const POST = async (req: NextRequest) => {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { error: "Please provide all missing fields." },
      { status: 403 }
    );
  }

  if (
    process.env.ADMIN_PASSWORD === password
  ) {
    const token = await generateAdminToken({ id: "", isAdmin: true });

    const response = NextResponse.json({
      message: "Admin Login Successfully.",
    });
    response.headers.set(
      "Set-Cookie",
      `user-token=${token}; HttpOnly; Path=/; Max-Age=${12 * 60 * 60}; Secure`
    );

    return response;
  }

  return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
};


