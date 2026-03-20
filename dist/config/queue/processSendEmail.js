"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../../utils/logger"));
// Configure email transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "2525"),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const processSendEmail = async (job) => {
    const { to, subject, text, html } = job.data;
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });
        logger_1.default.info(`Email sent: ${JSON.stringify(info)}`);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        logger_1.default.error(`Failed to send email: ${JSON.stringify(error)}`);
        throw error; // Job will be retried
    }
};
exports.default = processSendEmail;
