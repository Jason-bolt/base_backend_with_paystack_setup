import { Request, Response } from "express";
import requestsService from "../service";
import logger from "../../../../utils/logger";

class RequestsController {
  getAll = async (req: Request, res: Response) => {
    try {
      const { status, type, handoverMethod, search } = req.query as Record<string, string>;
      const items = await requestsService.getAll({ status, type, handoverMethod, search });
      return res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const item = await requestsService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const item = await requestsService.create(req.body);
      return res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const item = await requestsService.updateStatus(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  updateAdmin = async (req: Request, res: Response) => {
    try {
      const item = await requestsService.updateAdmin(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getByCode = async (req: Request, res: Response) => {
    try {
      const item = await requestsService.getByCode(req.params.code);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  selfSchedule = async (req: Request, res: Response) => {
    try {
      const { timeBlockId } = req.body as { timeBlockId: string };
      if (!timeBlockId) return res.status(400).json({ success: false, message: "timeBlockId is required" });
      const item = await requestsService.selfSchedule(req.params.code, timeBlockId);
      if (!item) return res.status(404).json({ success: false, message: "Not found or not ready to schedule" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

const requestsController = new RequestsController();
export default requestsController;
