import User from "../../../../libs/models/users.model";
import { dbConnect } from "../../../../libs/services/mongoose";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { sendEmail } from "../../../../libs/services/mailer";
import { generateVerificationEmail } from "../../../../libs/const";
import { generateOTP } from "../../../../libs/utils";
import { generateUserToken } from "../../../../libs/authUtils";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // Additional Validation does any field missing
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }
    const alreadyUser = await User.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });

    if (alreadyUser) {
      return NextResponse.json(
        {
          error: "User email already registered.",
        },
        { status: 403 }
      );
    }

    const otp = generateOTP();

    // Convert Plain Password into Hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    sendEmail(
      email,
      "OTP EMAIL VERIFICATION",
      generateVerificationEmail(name, otp)
    );

    // Create New User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp: otp,
    });
    await user.save();
    const verifyUserToken = await generateUserToken({
      email: user.email,
    });

    const response = NextResponse.json({
      message: "Account created need to verify, OTP valid for 10 mints.",
      token: verifyUserToken,
    });

    response.headers.set(
      "Set-Cookie",
      `verify-token=${verifyUserToken}; HttpOnly; Path=/; Max-Age=${
        10 * 60
      }; Secure; SameSite=None`
    );

    console.log("Done");

    return response;
  } catch (error) {
    console.log(error);

    if (error?.errorResponse?.code === 11000) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
};
