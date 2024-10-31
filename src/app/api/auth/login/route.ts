import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import User from "../../../../libs/models/users.model";
import { generateUserToken } from "../../../../libs/authUtils";
import * as bcrypt from "bcrypt";
import { dbConnect } from "../../../../libs/services/mongoose";
import { sendEmail } from "../../../../libs/services/mailer";
import { generateVerificationEmail } from "../../../../libs/const";
import { generateOTP } from "../../../../libs/utils";
import { corsHeaders } from "../../_utils";

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

/*
export const POST = async (request: NextRequest, response: NextResponse) => {
  const input = await request.json();
  console.log("[Login:Input] -", input);
  return Response.json(
    { message: "Hello World" },
    {
      status: 200,
      headers: {
        "Set-Cookie":
          "test-token=123123; Max-Age=604800; Path=/; HttpOnly; SameSite=None; Secure",
        ...corsHeaders,
      },
    }
  );
};
*/

export const POST = async (request: NextRequest, res: NextResponse) => {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (user.status == "inactive") {
      return NextResponse.json(
        { error: "Your account is blocked, contact Admin" },
        { status: 401 }
      );
    }

    console.log("H");

    if (!user.password) {
      return NextResponse.json(
        {
          error: "Please try login with Google.",
        },
        {
          status: 403,
        }
      );
    }

    console.log(password, user.password);

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("G");
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    console.log("A");

    if (!user.verify) {
      const otp = generateOTP();

      sendEmail(
        email,
        "OTP EMAIL VERIFICATION",
        generateVerificationEmail(user.name, otp)
      );

      user.otp = otp;

      await user.save();

      const response = NextResponse.json(
        {
          error: "Your Account is not verified, OTP sent valid 10 mints.",
          status: 307,
        },
        { status: 307 }
      );
      const verifyUserToken = await generateUserToken({
        email: email,
      });

      response.headers.set(
        "Set-Cookie",
        `verify-user=${verifyUserToken}; HttpOnly; Path=/; Max-Age=${
          10 * 60
        }; SameSite=None`
      );
      return response;
    }

    const token = await generateUserToken({ id: user.id, isAdmin: false });

    console.log("Login Successful");
    return Response.json(
      { message: "Login Successfully." },
      {
        status: 200,
        headers: {
          "Set-Cookie": `user-token=${token}; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=${
            12 * 60 * 60
          };`,
          ...corsHeaders,
        },
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
