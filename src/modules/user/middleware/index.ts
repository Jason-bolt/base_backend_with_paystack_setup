import { NextFunction, Request, Response } from "express";
import IMiddleware from "./Imiddleware";
import { ICreateUser, IUser } from "../types";
import { usersTable } from "../../../../config/db/schemas/User";
import db from "../../../../config/db";
import { eq } from "drizzle-orm";
import {
  createUserSchema,
  passwordCheckSchema,
} from "../../../../config/zod/schemas/user";
import logger from "../../../../utils/logger";
import bcrypt from "bcrypt";
import { getRedisData, setRedisData } from "../../../../utils/helpers/redis";
import jwt from "jsonwebtoken";
import envs from "../../../../config/envs";
import { GenericHelper } from "../../../../utils/helpers/generic.helpers";

class UserMiddleware implements IMiddleware {
  async validateCreateUser(req: Request, res: Response, next: NextFunction) {
    const validationResult = createUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.issues
          .map((issue) => issue.message)
          .join(", "),
      });
    }
    return next();
  }

  async isUniqueUser(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body as unknown as ICreateUser;

    if (!email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required field!",
      });
    }
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.trim()))
      .limit(1);

    logger.info(`Existing user: ${JSON.stringify(user)}`);

    if (user[0]) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }
    return next();
  }

  async validateLoginUser(req: Request, res: Response, next: NextFunction) {
    const { email: passedEmail, password: passedPassword } =
      req.body as unknown as Pick<ICreateUser, "email" | "password">;

    const email = passedEmail.trim();
    const password = passedPassword?.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required fields!",
      });
    }

    let userData: IUser | null = null;
    const redisData = await getRedisData(email);
    if (!redisData) {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      await setRedisData(`users:email:${email}`, user);
      userData = GenericHelper.camelize(user[0]);
    }

    logger.info(`Existing user: ${JSON.stringify(userData)}`);

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect!",
      });
    }
    if (
      !(await bcrypt.compare(password, (userData.password as string) || ""))
    ) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect!",
      });
    }

    return next();
  }

  async doesUserExistByEmail(req: Request, res: Response, next: NextFunction) {
    const { email: passedEmail } = req.body as unknown as Pick<
      ICreateUser,
      "email"
    >;
    const email = passedEmail.trim();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!",
      });
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    logger.info(`Existing user: ${JSON.stringify(user)}`);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }

    return next();
  }

  async confirmResetPasswordToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { reset_token: resetToken } = req.query as unknown as {
        reset_token: string;
      };

      if (!resetToken) {
        return res.status(400).json({
          success: false,
          message: "Reset token is missing!",
        });
      }

      try {
        const decodedToken = jwt.verify(resetToken, envs.JWT_SECRET) as {
          email: string;
        };

        const email = decodedToken?.email;
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .limit(1);

        (req as any).userEmail = email.trim();

        if (!user[0]) {
          return res.status(400).json({
            success: false,
            message: `Password reset failed!`,
          });
        }
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: `Failed to confirm password reset token: ${error.message}`,
          error: {
            message: error.message,
            stack: error.stack,
          },
        });
      }

      return next();
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: `Failed to confirm password reset token: ${error.message}`,
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    }
  }

  async validatePasswords(req: Request, res: Response, next: NextFunction) {
    const validationResult = passwordCheckSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.issues
          .map((issue) => issue.message)
          .join(", "),
      });
    }
    return next();
  }
}

const userMiddleware = new UserMiddleware();

export default userMiddleware;
