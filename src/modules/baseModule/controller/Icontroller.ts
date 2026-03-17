import { Request, Response } from "express";

interface IController {
  create: (req: Request, res: Response) => Promise<void>;
  read: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
}

export default IController;