import { Router } from "express";
import baseController from "./controller";

const baseRouter = Router();

baseRouter.post("/create", baseController.create);
baseRouter.get("/read", baseController.read);
baseRouter.put("/update", baseController.update);
baseRouter.delete("/delete", baseController.delete);

export default baseRouter;
