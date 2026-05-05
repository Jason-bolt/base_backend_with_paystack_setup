import db, { DB } from "../../../../config/db";
import { timeBlocksTable } from "../../../../config/db/schemas/TimeBlock";
import { GenericHelper } from "../../../../utils/helpers/generic.helpers";
import { ICreateTimeBlock, ITimeBlock, IUpdateTimeBlock } from "../types";
import { eq, and, SQL } from "drizzle-orm";

class TimeBlocksService {
  constructor(private readonly db: DB) {}

  async getAll(filter: { type?: string; status?: string } = {}): Promise<ITimeBlock[]> {
    const conditions: SQL[] = [];
    if (filter.type) conditions.push(eq(timeBlocksTable.type, filter.type));
    if (filter.status) conditions.push(eq(timeBlocksTable.status, filter.status));

    const rows = conditions.length
      ? await db.select().from(timeBlocksTable).where(and(...conditions))
      : await db.select().from(timeBlocksTable);

    return rows.map(r => GenericHelper.camelize<ITimeBlock>(r));
  }

  async getById(id: string): Promise<ITimeBlock | null> {
    const rows = await db.select().from(timeBlocksTable).where(eq(timeBlocksTable.id, id)).limit(1);
    return rows[0] ? GenericHelper.camelize<ITimeBlock>(rows[0]) : null;
  }

  async create(data: ICreateTimeBlock): Promise<ITimeBlock> {
    const row = await db
      .insert(timeBlocksTable)
      .values({
        id: GenericHelper.generateUUID(),
        type: data.type,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        capacity: data.capacity,
        booked_count: 0,
        location_zone: data.locationZone,
        status: "open",
      })
      .returning();
    return GenericHelper.camelize<ITimeBlock>(row[0]);
  }

  async update(id: string, data: IUpdateTimeBlock): Promise<ITimeBlock | null> {
    const updated = await db
      .update(timeBlocksTable)
      .set({
        ...(data.date && { date: data.date }),
        ...(data.startTime && { start_time: data.startTime }),
        ...(data.endTime && { end_time: data.endTime }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.locationZone !== undefined && { location_zone: data.locationZone }),
        ...(data.status && { status: data.status }),
        updated_at: new Date(),
      })
      .where(eq(timeBlocksTable.id, id))
      .returning();
    return updated[0] ? GenericHelper.camelize<ITimeBlock>(updated[0]) : null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(timeBlocksTable).where(eq(timeBlocksTable.id, id));
  }

  async incrementBookedCount(id: string): Promise<void> {
    const block = await this.getById(id);
    if (!block) return;
    const newCount = block.bookedCount + 1;
    const newStatus = newCount >= block.capacity ? "closed" : "open";
    await db
      .update(timeBlocksTable)
      .set({ booked_count: newCount, status: newStatus, updated_at: new Date() })
      .where(eq(timeBlocksTable.id, id));
  }
}

const timeBlocksService = new TimeBlocksService(db);
export default timeBlocksService;
