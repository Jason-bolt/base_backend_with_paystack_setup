import { NextFunction, Request, Response } from "express";

interface IMiddleware {
    validateCreateUser: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    isUniqueUser: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    validateLoginUser: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    doesUserExistByEmail: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    confirmResetPasswordToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    validatePasswords: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}

export default IMiddleware;