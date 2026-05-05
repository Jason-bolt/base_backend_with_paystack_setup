import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import envs from "../../../../config/envs";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const changeCredentialsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newUsername: z.string().min(3).max(50).optional(),
  newPassword: z.string().min(6).max(100).optional(),
}).refine(data => data.newUsername || data.newPassword, {
  message: "Provide at least a new username or new password",
});

class AuthMiddleware {
  validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error.issues[0].message });
    }
    return next();
  };

  validateChangeCredentials = (req: Request, res: Response, next: NextFunction) => {
    const result = changeCredentialsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error.issues[0].message });
    }
    return next();
  };

  requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, envs.JWT_SECRET);
      (req as any).admin = decoded;
      return next();
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;
