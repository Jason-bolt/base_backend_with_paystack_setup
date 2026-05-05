import { Router } from "express";
import contributionsController from "./controller";
import contributionsMiddleware from "./middleware";
import authMiddleware from "../auth/middleware";

const contributionsRouter = Router();

// Public - submit & track
contributionsRouter.post("/", contributionsController.create);
contributionsRouter.get("/track/:code", contributionsController.getByCode);
contributionsRouter.post(
  "/upload/photo",
  contributionsMiddleware.uploadPhoto,
  contributionsController.uploadPhoto
);

// Admin - protected
contributionsRouter.get("/", authMiddleware.requireAuth, contributionsController.getAll);
contributionsRouter.get("/:id", authMiddleware.requireAuth, contributionsController.getById);
contributionsRouter.patch("/:id/status", authMiddleware.requireAuth, contributionsController.updateStatus);
contributionsRouter.patch("/:id/admin", authMiddleware.requireAuth, contributionsController.updateAdmin);
contributionsRouter.post("/:id/approve", authMiddleware.requireAuth, contributionsController.approve);

export default contributionsRouter;
