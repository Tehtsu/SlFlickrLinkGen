import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT
  ? Number(process.env.SMTP_PORT)
  : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM;
const smtpSecure = process.env.SMTP_SECURE === "true";

function getTransport() {
  if (!smtpHost || !smtpPort || !smtpFrom) {
    throw new Error("SMTP configuration is missing");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth:
      smtpUser && smtpPass
        ? {
          user: smtpUser,
          pass: smtpPass,
        }
        : undefined,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset?token=${encodeURIComponent(
    token
  )}`;

  const transporter = getTransport();

  await transporter.sendMail({
    from: smtpFrom,
    to: email,
    subject: "Link Generator for Flickr and SL - Reset Password",
    text: [
      "Hello,",
      "",
      "You have requested a password reset.",
      `Reset link: ${resetUrl}`,
      "",
      "If the link does not work, use this token in the app:",
      token,
      "",
      "If you did not make the request, you can ignore this email.",
      "",
      "Questions? Contact stream@mrjyn.info",
    ].join("\n"),
  });
}

export async function sendAdminSetPasswordEmail(
  email: string,
  password: string
) {
  const transporter = getTransport();
  await transporter.sendMail({
    from: smtpFrom,
    to: email,
    subject:
      "Link Generator for Flickr and SL - Your temporary password",
    text: [
      "Hello,",
      "",
      "Your password has been reset by an administrator.",
      `New temporary password: ${password}`,
      "",
      "Please log in and change the password to your own immediately.",
      "",
      "If you have any questions, please contact support.: support@mrjyn.info",
    ].join("\n"),
  });
}
