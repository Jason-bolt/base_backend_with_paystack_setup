import { Request, Response, NextFunction } from "express";

const requestsMiddleware = {
  validateCreate: (req: Request, res: Response, next: NextFunction) => {
    const { type, requesterName, email, phone, contactChannel, location, handoverMethod } = req.body;
    if (!type || !requesterName || !email || !phone || !contactChannel || !location || !handoverMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    return next();
  },
};

export default requestsMiddleware;
