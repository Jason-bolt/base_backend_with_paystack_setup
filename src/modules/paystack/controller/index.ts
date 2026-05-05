import IController from "./Icontroller";
import { Request, Response } from "express";
import PaystackService from "../service";
import paystackService from "../service";
import crypto from "crypto";
import envs from "../../../../config/envs";
import logger from "../../../../utils/logger";

class PaystackController implements IController {
  constructor(private readonly service: typeof PaystackService) {}

  initializeTransaction = async (req: Request, res: Response) => {
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
    } catch (error: any) {
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

  verifyTransaction = async (req: Request, res: Response) => {
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
    } catch (error: any) {
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

  processWebhook = async (req: Request, res: Response) => {
    try {
      const hash = crypto
        .createHmac("sha512", envs.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest("hex");

      logger.info(`Hash: ${hash}`);
      if (hash == req.headers["x-paystack-signature"]) {
        // Retrieve the request's body
        const event = req.body;
        // Do something with event
        logger.info(`Webhook event: ${JSON.stringify(event)}`);
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
    } catch (error: any) {
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

const paystackController = new PaystackController(paystackService);
export default paystackController;
