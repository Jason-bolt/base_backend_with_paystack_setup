import { Request, Response } from "express";
import authService from "../service";
import logger from "../../../../utils/logger";

class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error(error);
      return res.status(401).json({ success: false, message: error.message });
    }
  };

  changeCredentials = async (req: Request, res: Response) => {
    try {
      const admin = (req as any).admin;
      const { currentPassword, newUsername, newPassword } = req.body;
      const result = await authService.changeCredentials(
        admin.id,
        currentPassword,
        newUsername,
        newPassword
      );
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error(error);
      const status = error.message === "Current password is incorrect" ? 401 : 400;
      return res.status(status).json({ success: false, message: error.message });
    }
  };
}

const authController = new AuthController();
export default authController;
