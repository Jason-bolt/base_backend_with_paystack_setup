import db, { DB } from "../../../../config/db";
import logger from "../../../../utils/logger";
import IService from "./Iservice";
import envs from "../../../../config/envs";
import { v4 as uuidv4 } from "uuid";
import { SUB_UNIT_MULTIPLIER } from "../../../../config/constants/paystack";

class PaystackService implements IService {
  constructor(private readonly db: DB) {}

  async initializeTransaction(data: any) {
    try {
      const reference = uuidv4();
      logger.info(`Reference: ${reference}`);
      const body = JSON.stringify({
        email: data.email,
        amount: data.amount * SUB_UNIT_MULTIPLIER,
        channels: ["card", "bank", "mobile_money", "bank_transfer"],
        currency: "GHS",
        callback_url: `${envs.PAYSTACK_CALLBACK_URL}`,
        reference,
      });

      const baseUrl = envs.PAYSTACK_BASE_URL;
      const url = `${baseUrl}/transaction/initialize`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${envs.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body,
      });

      const responseData = await response.json();
      logger.info(`Paystack response: ${JSON.stringify(responseData)}`);
      return responseData;
    } catch (error) {
      throw new Error("Failed to initialize transaction");
    }
  }
  
  async verifyTransaction(reference: string) {
    try {
      const baseUrl = envs.PAYSTACK_BASE_URL;
      const url = `${baseUrl}/transaction/verify/${reference}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${envs.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      logger.info(`Paystack response: ${JSON.stringify(responseData)}`);
      return responseData;
    } catch (error) {
      throw new Error("Failed to verify transaction");
    }
  }
}

const paystackService = new PaystackService(db);
export default paystackService;
