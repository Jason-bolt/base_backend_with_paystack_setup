import { Request, Response, NextFunction } from "express";

const timeBlocksMiddleware = {
  validateCreate: (req: Request, res: Response, next: NextFunction) => {
    const { type, date, startTime, endTime, capacity } = req.body;
    if (!type || !date || !startTime || !endTime || !capacity) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    return next();
  },
};

export default timeBlocksMiddleware;
