import { Router } from "express";
import stockController from "./controller";
import stockMiddleware from "./middleware";
import authMiddleware from "../auth/middleware";

const stockRouter = Router();

// Public - catalogue for requesters
stockRouter.get("/public", stockController.getPublicListed);

// Admin - protected
stockRouter.get("/", authMiddleware.requireAuth, stockController.getAll);
stockRouter.get("/:id", authMiddleware.requireAuth, stockController.getById);
stockRouter.post("/", authMiddleware.requireAuth, stockController.create);
stockRouter.put("/:id", authMiddleware.requireAuth, stockController.update);
stockRouter.delete("/:id", authMiddleware.requireAuth, stockController.delete);
stockRouter.post(
  "/upload/photo",
  authMiddleware.requireAuth,
  stockMiddleware.uploadPhoto,
  stockController.uploadPhoto
);

export default stockRouter;
