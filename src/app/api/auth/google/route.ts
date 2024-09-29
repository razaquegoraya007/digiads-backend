import { NextRequest, NextResponse } from "next/server";
import User from "../../../../libs/models/users.model";
import { dbConnect } from "../../../../libs/services/mongoose";
import { generateUserToken } from "../../../../libs/authUtils";
import Stripe from "stripe";
import { generateOTP } from "../../../../libs/utils";
import { sendEmail } from "../../../../libs/services/mailer";
import { generateVerificationEmail } from "../../../../libs/const";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const { accessToken } = await req.json();

    const userInfoEndpoint = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`;

    const response = await fetch(userInfoEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user information" },
        { status: 400 }
      );
    }

    const userInfo = await response.json();

    const user = await User.findOne({ email: userInfo.email });

    if (user) {
      if (user.status == "inactive") {
        return NextResponse.json(
          { error: "Your account is blocked, contact Admin" },
          { status: 401 }
        );
      }
      if (!user.verify) {
        const otp = generateOTP();

        sendEmail(
          user.email,
          "OTP EMAIL VERIFICATION",
          generateVerificationEmail(user.name, otp)
        );

        user.otp = otp;

        await user.save();

        const response = NextResponse.json(
          {
            error: "Your Account is not verified, OTP sent valid 10 mints.",
          },
          { status: 307 }
        );
        const verifyUserToken = await generateUserToken({
          email: user.email,
        });
        response.headers.set(
          "Set-Cookie",
          `verify-user=${verifyUserToken}; HttpOnly; Path=/; Max-Age=${
            10 * 60
          }; Secure`
        );
        return response;
      }

      const token = await generateUserToken({ id: user.id, isAdmin: false });

      const response = NextResponse.json({
        message: "Login Successfully.",
      });
      response.headers.set(
        "Set-Cookie",
        `user-token=${token}; HttpOnly; Path=/; Max-Age=${12 * 60 * 60}; Secure`
      );

      return response;
    }

    // Create Stripe Customer
    const customer = await stripe.customers.create({
      email: userInfo.email,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: process.env.FREE_SUBSCRIPTION_PRICE_ID }],
      cancel_at_period_end: true,
    });

    const newUser = new User({
      name: userInfo.name,
      email: userInfo.email,
      verify: true,
      customerId: customer.id,
      subscriptionId: subscription.id,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User Logged In by google successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching user information" },
      { status: 500 }
    );
  }
};
