import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { signToken } from "@/utils/jwt";
import { ro } from "date-fns/locale";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();

    const user = await User.findOne({ email });

    if (!user || !user.loginOtp?.codeHash) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // check expiry
    if (user.loginOtp.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // compare OTP
    const isMatch = await bcrypt.compare(
      otp,
      user.loginOtp.codeHash
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // clear OTP
    user.loginOtp = undefined;
    await user.save();

    console.log("Login OTP verified for user:", user);

    // generate JWT
    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    return NextResponse.json({
      role: user.role,
      message: "Login successful",
      token,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}