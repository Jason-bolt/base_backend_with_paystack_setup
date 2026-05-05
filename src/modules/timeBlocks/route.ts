import { Router } from "express";
import timeBlocksController from "./controller";
import timeBlocksMiddleware from "./middleware";
import authMiddleware from "../auth/middleware";

const timeBlocksRouter = Router();

// Public - available time blocks for requesters
timeBlocksRouter.get("/public", async (req, res) => {
  const { type } = req.query as { type?: string };
  const { default: svc } = await import("./service");
  const blocks = await svc.getAll({ type, status: "open" });
  return res.status(200).json({ success: true, data: blocks });
});

// Admin - protected
timeBlocksRouter.get("/", authMiddleware.requireAuth, timeBlocksController.getAll);
timeBlocksRouter.get("/:id", authMiddleware.requireAuth, timeBlocksController.getById);
timeBlocksRouter.post("/", authMiddleware.requireAuth, timeBlocksMiddleware.validateCreate, timeBlocksController.create);
timeBlocksRouter.put("/:id", authMiddleware.requireAuth, timeBlocksController.update);
timeBlocksRouter.delete("/:id", authMiddleware.requireAuth, timeBlocksController.delete);

export default timeBlocksRouter;
