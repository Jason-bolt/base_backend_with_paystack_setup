"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../../../config/db"));
const logger_1 = __importDefault(require("../../../../utils/logger"));
const envs_1 = __importDefault(require("../../../../config/envs"));
const uuid_1 = require("uuid");
const paystack_1 = require("../../../../config/constants/paystack");
class PaystackService {
    constructor(db) {
        this.db = db;
    }
    async initializeTransaction(data) {
        try {
            const reference = (0, uuid_1.v4)();
            logger_1.default.info(`Reference: ${reference}`);
            const body = JSON.stringify({
                email: data.email,
                amount: data.amount * paystack_1.SUB_UNIT_MULTIPLIER,
                channels: ["card", "bank", "mobile_money", "bank_transfer"],
                currency: "GHS",
                callback_url: `${envs_1.default.PAYSTACK_CALLBACK_URL}`,
                reference,
            });
            const baseUrl = envs_1.default.PAYSTACK_BASE_URL;
            const url = `${baseUrl}/transaction/initialize`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${envs_1.default.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                body,
            });
            const responseData = await response.json();
            logger_1.default.info(`Paystack response: ${JSON.stringify(responseData)}`);
            return responseData;
        }
        catch (error) {
            throw new Error("Failed to initialize transaction");
        }
    }
    async verifyTransaction(reference) {
        try {
            const baseUrl = envs_1.default.PAYSTACK_BASE_URL;
            const url = `${baseUrl}/transaction/verify/${reference}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${envs_1.default.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            const responseData = await response.json();
            logger_1.default.info(`Paystack response: ${JSON.stringify(responseData)}`);
            return responseData;
        }
        catch (error) {
            throw new Error("Failed to verify transaction");
        }
    }
}
const paystackService = new PaystackService(db_1.default);
exports.default = paystackService;
