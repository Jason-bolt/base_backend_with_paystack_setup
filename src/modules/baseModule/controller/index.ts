import IController from "./Icontroller";
import { Request, Response } from "express";
import BaseService from "../service";
import baseService from "../service";

class BaseController implements IController {
  constructor(private readonly service: typeof BaseService) {}

  async create(req: Request, res: Response) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async read(req: Request, res: Response) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to read user");
    }
  }

  async update(req: Request, res: Response) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
}

const baseController = new BaseController(baseService);
export default baseController;