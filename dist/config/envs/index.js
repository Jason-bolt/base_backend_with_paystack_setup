"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const envs = {
    PORT: parseInt(process.env.PORT || "3000"),
    NODE_ENV: process.env.NODE_ENV || "development",
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "",
    PAYSTACK_BASE_URL: process.env.PAYSTACK_BASE_URL || "",
    PAYSTACK_CALLBACK_URL: process.env.PAYSTACK_CALLBACK_URL || "",
    DATABASE_URL: process.env.DATABASE_URL || "",
    EMAIL_HOST: process.env.EMAIL_HOST || "",
    EMAIL_PORT: process.env.EMAIL_PORT || "",
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
    REDIS_URL: process.env.REDIS_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY || "",
};
exports.default = envs;
