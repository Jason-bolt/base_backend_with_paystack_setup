import { Request, Response } from "express";
import timeBlocksService from "../service";
import logger from "../../../../utils/logger";

class TimeBlocksController {
  getAll = async (req: Request, res: Response) => {
    try {
      const { type, status } = req.query as Record<string, string>;
      const blocks = await timeBlocksService.getAll({ type, status });
      return res.status(200).json({ success: true, data: blocks });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const block = await timeBlocksService.getById(req.params.id);
      if (!block) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: block });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const block = await timeBlocksService.create(req.body);
      return res.status(201).json({ success: true, data: block });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const block = await timeBlocksService.update(req.params.id, req.body);
      if (!block) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: block });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await timeBlocksService.delete(req.params.id);
      return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

const timeBlocksController = new TimeBlocksController();
export default timeBlocksController;
