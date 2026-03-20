import db, { DB } from "../../../../config/db";
import IService from "./Iservice";

class BaseService implements IService {
  constructor(private readonly db: DB) {}

  async create(data: any) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to create base");
    }
  }

  async read(id: string) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to read base");
    }
  }

  async update(id: string, data: any) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to update base");
    }
  }

  async delete(id: string) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to delete base");
    }
  }
}

const baseService = new BaseService(db);
export default baseService;