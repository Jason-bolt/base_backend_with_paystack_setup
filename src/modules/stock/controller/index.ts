import { Request, Response } from "express";
import stockService from "../service";
import { uploadToCloudinary } from "../../../../utils/helpers/cloudinary";
import logger from "../../../../utils/logger";

class StockController {
  getAll = async (req: Request, res: Response) => {
    try {
      const { category, availability, visibility, search } = req.query as Record<string, string>;
      const items = await stockService.getAll({ category, availability, visibility, search });
      return res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getPublicListed = async (_req: Request, res: Response) => {
    try {
      const items = await stockService.getPublicListed();
      return res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const item = await stockService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const item = await stockService.create(req.body);
      return res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const item = await stockService.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await stockService.delete(req.params.id);
      return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  uploadPhoto = async (req: Request, res: Response) => {
    try {
      const file = (req as any).file;
      if (!file) return res.status(400).json({ success: false, message: "No file provided" });
      const url = await uploadToCloudinary(file.buffer, "stock");
      return res.status(200).json({ success: true, data: { url } });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

const stockController = new StockController();
export default stockController;
