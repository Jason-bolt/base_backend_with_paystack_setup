import { Request, Response } from "express";

interface IController {
  initializeTransaction: (req: Request, res: Response) => Promise<Response>;
  verifyTransaction: (req: Request, res: Response) => Promise<Response>;
  processWebhook: (req: Request, res: Response) => Promise<Response>;
}

export default IController;