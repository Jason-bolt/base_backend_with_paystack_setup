import { Router } from "express";
import paystackController from "./controller";

const paystackRouter = Router();

paystackRouter.post("/initialize", paystackController.initializeTransaction);
paystackRouter.get("/verify/:reference", paystackController.verifyTransaction);
paystackRouter.post("/webhook", paystackController.processWebhook);

export default paystackRouter;
