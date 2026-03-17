// worker.js
import { Worker } from "bullmq";
import "dotenv/config";
import processSendEmail from "./processSendEmail";
import { QueueEvents } from "bullmq";
import logger from "../../utils/logger";

const queueEvents = new QueueEvents("app-queue");

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  // password: process.env.REDIS_PASSWORD // if needed
};

const worker = new Worker(
  "app-queue",
  async (job) => {
    logger.info(`Processing job: ${job.name}`);

    switch (job.name) {
      case "sendEmail":
        await processSendEmail(job);
        break;
      // case 'imageProcessing':
      //   await processImage(job.data);
      //   break;
      default:
        logger.warn(`Unknown job name: ${job.name}`);
    }
  },
  { connection }
);

worker.on("ready", () => {
  logger.info("🔧 Worker is ready and waiting for jobs");
});

worker.on("error", (error) => {
  logger.error(`Worker error: ${JSON.stringify(error)}`);
});

worker.on("closing", () => {
  logger.info("🔧 Worker is closing...");
});

queueEvents.on("completed", (job) => {
  logger.info(`Job ${job.jobId} completed`);
});

queueEvents.on("failed", (job, error) => {
  logger.error(`Job ${job.jobId} failed: ${JSON.stringify(error)}`);
});

queueEvents.on("stalled", (job) => {
  logger.info(`Job ${job.jobId} stalled`);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing worker...");
  await worker.close();
  await queueEvents.close();
  process.exit(0);
});
