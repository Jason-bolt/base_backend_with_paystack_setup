import { Request, Response } from "express";

interface IController {
  signUpUser: (req: Request, res: Response) => Promise<Response>;
  loginUser: (req: Request, res: Response) => Promise<Response>;
  initiatePasswordReset: (req: Request, res: Response) => Promise<Response>;
  resetPassword: (req: Request, res: Response) => Promise<Response>;
  // getUser: (req: Request, res: Response) => Promise<void>;
  // getUsers: (req: Request, res: Response) => Promise<void>;
  // updateUser: (req: Request, res: Response) => Promise<void>;
  // deleteUser: (req: Request, res: Response) => Promise<void>;
}

export default IController;