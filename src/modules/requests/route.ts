import { Router } from "express";
import requestsController from "./controller";
import requestsMiddleware from "./middleware";
import authMiddleware from "../auth/middleware";

const requestsRouter = Router();

// Public - submit a request
requestsRouter.post("/", requestsMiddleware.validateCreate, requestsController.create);

// Public - track by code
requestsRouter.get("/track/:code", requestsController.getByCode);
requestsRouter.post("/track/:code/schedule", requestsController.selfSchedule);

// Admin - protected
requestsRouter.get("/", authMiddleware.requireAuth, requestsController.getAll);
requestsRouter.get("/:id", authMiddleware.requireAuth, requestsController.getById);
requestsRouter.patch("/:id/status", authMiddleware.requireAuth, requestsController.updateStatus);
requestsRouter.patch("/:id/admin", authMiddleware.requireAuth, requestsController.updateAdmin);

export default requestsRouter;
