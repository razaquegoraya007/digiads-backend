import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../libs/services/mongoose";
import User from "../../../../../libs/models/users.model";
import { decodeToken, decodeVerifyToken } from "../../../../../libs/authUtils";
import { generateOTP } from "../../../../../libs/utils";
import { sendEmail } from "../../../../../libs/services/mailer";
import { generateVerificationEmail } from "../../../../../libs/const";

interface UserEmailPayload {
  email: string;
}

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const { otp } = await req.json();
    const token = req.cookies.get("verify-user");

    if (!token || !otp) {
      return NextResponse.json(
        { error: "Invalid user or OTP not provided" },
        { status: 400 }
      );
    }

    const verifyUser = (await decodeVerifyToken(
      token.value
    )) as UserEmailPayload;

    const user = await User.findOne({ email: verifyUser.email }).collation({
      locale: "en",
      strength: 2,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.otp != otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    user.otp = undefined;
    user.verify = true;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await dbConnect();

    const token = req.cookies.get("verify-user");

    if (!token) {
      return NextResponse.json(
        { error: "You are not allowed." },
        { status: 400 }
      );
    }

    const verifyUser = (await decodeVerifyToken(
      token.value
    )) as UserEmailPayload;

    const user = await User.findOne({ email: verifyUser.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newOtp = generateOTP();
    user.otp = newOtp;
    await user.save();

    sendEmail(
      user.email,
      "OTP EMAIL VERIFICATION",
      generateVerificationEmail(user.name, newOtp)
    );

    return NextResponse.json(
      { message: "A new OTP has been sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
};
