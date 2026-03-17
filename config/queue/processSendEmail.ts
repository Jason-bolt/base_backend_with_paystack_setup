import "dotenv/config";
import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import logger from "../../utils/logger";

// Configure email transporter
const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "2525"),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
const processSendEmail = async (job: any) => {
    const { to, subject, text, html } = job.data;

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      });
  
      logger.info(`Email sent: ${JSON.stringify(info)}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Failed to send email: ${JSON.stringify(error)}`);
      throw error; // Job will be retried
    }
};

export default processSendEmail;