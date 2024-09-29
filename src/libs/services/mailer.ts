import nodemailer from "nodemailer";
import fetch from "node-fetch";

export const sendEmail = async (
  senderEmail,
  subject,
  textContent = "",
  htmlContent = ""
) => {
  console.log(senderEmail);

  console.log({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // Use secure only if port is 465
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
    authMethod: "PLAIN",
  });

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
    authMethod: "PLAIN",
    // Increase connection timeout
    connectionTimeout: 10000, // 10 seconds
    // Enable debug mode
    logger: true,
    debug: true,
  });

  const sendingEmailConfig =
    textContent?.length > 0
      ? {
          from: `Digiads ${process.env.SMTP_EMAIL}`,
          sender: process.env.SMTP_EMAIL,
          subject: subject,
          to: senderEmail,
          text: textContent,
        }
      : {
          from: `Digiads ${process.env.SMTP_EMAIL}`,
          sender: process.env.SMTP_EMAIL,
          subject: subject,
          to: senderEmail,
          html: htmlContent,
        };

  try {
    const info = await transport.sendMail(sendingEmailConfig);
    console.log("Info", info);

    return { success: true, info: info };
  } catch (error) {
    console.log("Error", error);
    return { success: false, error: error.message };
  }
};
