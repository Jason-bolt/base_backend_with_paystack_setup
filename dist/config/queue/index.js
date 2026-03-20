"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.AppQueue = void 0;
const bullmq_1 = require("bullmq");
require("dotenv/config");
const logger_1 = __importDefault(require("../../utils/logger"));
const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    // password: process.env.REDIS_PASSWORD // if needed
};
exports.AppQueue = new bullmq_1.Queue("app-queue", { connection });
const sendEmail = async (emailData) => {
    await exports.AppQueue.add("sendEmail", emailData, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
    logger_1.default.info(`Email job added: ${JSON.stringify(emailData)}`);
};
exports.sendEmail = sendEmail;
