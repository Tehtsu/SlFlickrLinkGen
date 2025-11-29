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
    subject: "Passwort zurücksetzen",
    text: [
      "Hallo,",
      "",
      "du hast ein Zurücksetzen deines Passworts angefordert.",
      `Reset-Link: ${resetUrl}`,
      "",
      "Sollte der Link nicht funktionieren, nutze diesen Token in der App:",
      token,
      "",
      "Falls du die Anfrage nicht gestellt hast, kannst du diese Email ignorieren.",
    ].join("\n"),
  });
}
