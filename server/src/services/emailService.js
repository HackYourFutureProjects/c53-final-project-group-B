import crypto from "crypto";
import transporter from "../util/mail.js";
import Token from "../models/emailToken.js";

const BACKEND_URL = process.env.BACKEND_URL;

export const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  await Token.create({ userId: user._id, token, purpose: "verify-email" });
  const verificationLink = `${BACKEND_URL}/api/verify/verify-email/${user._id}/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email – Dropit",

    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto;">
      <div style="text-align: center;">
        <h2> Dropit </h2>
      </div>

      <h2>Email Verification</h2>

      <p>Hello ${user.name || ""},</p>

      <p>We received a request to verify your email address. Please click the button below to complete your verification:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}"
           style="background-color: #007bff; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Verify Email
        </a>
      </div>

      <p>If the button above doesn’t work, you can also verify by clicking this link:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>

      <p>Thank you for choosing <strong>Dropit</strong>!</p>

      <br>
      <p style="font-size: 12px; color: #888;">
        This is an automated message. If you didn’t request this, you can safely ignore it.
      </p>
    </div>
  `,
  });
};
