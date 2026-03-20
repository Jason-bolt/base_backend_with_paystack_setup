"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// worker.js
const bullmq_1 = require("bullmq");
require("dotenv/config");
const processSendEmail_1 = __importDefault(require("./processSendEmail"));
const bullmq_2 = require("bullmq");
const logger_1 = __importDefault(require("../../utils/logger"));
const queueEvents = new bullmq_2.QueueEvents("app-queue");
const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    // password: process.env.REDIS_PASSWORD // if needed
};
const worker = new bullmq_1.Worker("app-queue", async (job) => {
    logger_1.default.info(`Processing job: ${job.name}`);
    switch (job.name) {
        case "sendEmail":
            await (0, processSendEmail_1.default)(job);
            break;
        // case 'imageProcessing':
        //   await processImage(job.data);
        //   break;
        default:
            logger_1.default.warn(`Unknown job name: ${job.name}`);
    }
}, { connection });
worker.on("ready", () => {
    logger_1.default.info("🔧 Worker is ready and waiting for jobs");
});
worker.on("error", (error) => {
    logger_1.default.error(`Worker error: ${JSON.stringify(error)}`);
});
worker.on("closing", () => {
    logger_1.default.info("🔧 Worker is closing...");
});
queueEvents.on("completed", (job) => {
    logger_1.default.info(`Job ${job.jobId} completed`);
});
queueEvents.on("failed", (job, error) => {
    logger_1.default.error(`Job ${job.jobId} failed: ${JSON.stringify(error)}`);
});
queueEvents.on("stalled", (job) => {
    logger_1.default.info(`Job ${job.jobId} stalled`);
});
process.on("SIGTERM", async () => {
    logger_1.default.info("SIGTERM received, closing worker...");
    await worker.close();
    await queueEvents.close();
    process.exit(0);
});
