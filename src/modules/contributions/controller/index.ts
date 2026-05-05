import { Request, Response } from "express";
import contributionsService from "../service";
import { uploadToCloudinary } from "../../../../utils/helpers/cloudinary";
import logger from "../../../../utils/logger";

class ContributionsController {
  getAll = async (req: Request, res: Response) => {
    try {
      const { status, category } = req.query as Record<string, string>;
      const items = await contributionsService.getAll({ status, category });
      return res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const item = await contributionsService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const item = await contributionsService.create(req.body);
      return res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const item = await contributionsService.updateStatus(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  updateAdmin = async (req: Request, res: Response) => {
    try {
      const item = await contributionsService.updateAdmin(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  approve = async (req: Request, res: Response) => {
    try {
      const { items } = req.body as { items: any[] };
      const contribution = await contributionsService.approve(req.params.id, items ?? []);
      if (!contribution) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: contribution });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getByCode = async (req: Request, res: Response) => {
    try {
      const item = await contributionsService.getByCode(req.params.code);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  uploadPhoto = async (req: Request, res: Response) => {
    try {
      const file = (req as any).file;
      if (!file) return res.status(400).json({ success: false, message: "No file provided" });
      const url = await uploadToCloudinary(file.buffer, "contributions");
      return res.status(200).json({ success: true, data: { url } });
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

const contributionsController = new ContributionsController();
export default contributionsController;
