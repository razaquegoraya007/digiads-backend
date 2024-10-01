import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../libs/services/mongoose";
import User from "../../../../../libs/models/users.model";
import {
  decodeVerifyToken,
  generateUserToken,
} from "../../../../../libs/authUtils";
import { sendEmail } from "../../../../../libs/services/mailer";
import { generateResetPasswordHTMLEmail } from "../../../../../libs/const";
import * as bcrypt from "bcrypt";

interface UserEmailPayload {
  email: string;
}

export const GET = async (req: NextRequest) => {
  await dbConnect();

  const token = req.headers.get("reset-token");

  console.log(token);

  if (!token) {
    return NextResponse.json({ error: "No token provided." }, { status: 400 });
  }

  console.log(token);

  const payload = (await decodeVerifyToken(token)) as UserEmailPayload;
  const email = payload.email;

  console.log(email);

  const user = await User.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const resetToken = await generateUserToken({
    email: user.email,
  });

  const response = NextResponse.json({
    message: "Identity verified, move forward.",
  });

  response.headers.set(
    "Set-Cookie",
    `reset-token=${resetToken}; HttpOnly; Path=/; Max-Age=${10 * 60}; Secure`
  );
  return response;
};

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    let { email } = await req.json();

    console.log(email);

    email = email.toLowerCase();

    const user = await User.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });

    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist." },
        { status: 404 }
      );
    }

    const resetToken = await generateUserToken({
      email: user.email,
    });

    const resetLink = `${process.env.APP_BASE_URL}/change-pass/index.html?token=${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      null,
      generateResetPasswordHTMLEmail(user.name, resetLink)
    );

    return NextResponse.json(
      { message: "Reset password email sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return NextResponse.json(
      { error: "Failed to send reset password email. Please try again." },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await dbConnect();

    const { password, token } = await req.json();

    console.log(token);

    if (!token) {
      return NextResponse.json(
        { error: "No token provided." },
        { status: 400 }
      );
    }
    const payload = (await decodeVerifyToken(token)) as UserEmailPayload;
    const email = payload.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
};
