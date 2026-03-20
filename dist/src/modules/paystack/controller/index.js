"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../service"));
const crypto_1 = __importDefault(require("crypto"));
const envs_1 = __importDefault(require("../../../../config/envs"));
const logger_1 = __importDefault(require("../../../../utils/logger"));
class PaystackController {
    constructor(service) {
        this.service = service;
        this.initializeTransaction = async (req, res) => {
            try {
                const response = await this.service.initializeTransaction(req.body);
                if (response.status !== "true") {
                    return res.status(400).json({
                        success: false,
                        message: "Transaction initialization failed",
                        data: response,
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Transaction initialized successfully",
                    data: response,
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to initialize transaction",
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        };
        this.verifyTransaction = async (req, res) => {
            try {
                const reference = req.params.reference;
                const response = await this.service.verifyTransaction(reference);
                if (response.status !== "true") {
                    return res.status(400).json({
                        success: false,
                        message: "Transaction verification failed",
                        data: response,
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Transaction verified successfully",
                    data: response,
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to verify transaction",
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        };
        this.processWebhook = async (req, res) => {
            try {
                const hash = crypto_1.default
                    .createHmac("sha512", envs_1.default.PAYSTACK_SECRET_KEY)
                    .update(JSON.stringify(req.body))
                    .digest("hex");
                logger_1.default.info(`Hash: ${hash}`);
                if (hash == req.headers["x-paystack-signature"]) {
                    // Retrieve the request's body
                    const event = req.body;
                    // Do something with event
                    logger_1.default.info(`Webhook event: ${JSON.stringify(event)}`);
                    return res.status(200).json({
                        success: true,
                        message: "Webhook processed successfully",
                        data: event,
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: "Webhook verification failed",
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to process webhook",
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        };
    }
}
const paystackController = new PaystackController(service_1.default);
exports.default = paystackController;
