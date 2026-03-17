import { Queue } from "bullmq";
import "dotenv/config";
import logger from "../../utils/logger";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  // password: process.env.REDIS_PASSWORD // if needed
};

export const AppQueue = new Queue("app-queue", { connection });

export interface EmailJob {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async (emailData: EmailJob) => {
  await AppQueue.add("sendEmail", emailData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });

  logger.info(`Email job added: ${JSON.stringify(emailData)}`);
};
