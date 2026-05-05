import db, { DB } from "../../../../config/db";
import { stockItemsTable } from "../../../../config/db/schemas/StockItem";
import { GenericHelper } from "../../../../utils/helpers/generic.helpers";
import { ICreateStockItem, IStockFilter, IStockItem, IUpdateStockItem } from "../types";
import { eq, ilike, and, SQL } from "drizzle-orm";

const LOW_STOCK_THRESHOLD = 5;

function computeAvailability(qty: number): string {
  if (qty <= 0) return "out-of-stock";
  if (qty <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "available";
}

function parsePhotos(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

function serializePhotos(photos: string[]): string {
  return photos.join(",");
}

class StockService {
  constructor(private readonly db: DB) {}

  async getAll(filter: IStockFilter = {}): Promise<IStockItem[]> {
    const conditions: SQL[] = [];
    if (filter.category) conditions.push(eq(stockItemsTable.category, filter.category));
    if (filter.availability) conditions.push(eq(stockItemsTable.availability, filter.availability));
    if (filter.visibility) conditions.push(eq(stockItemsTable.visibility, filter.visibility));
    if (filter.search) conditions.push(ilike(stockItemsTable.title, `%${filter.search}%`));

    const rows = conditions.length
      ? await db.select().from(stockItemsTable).where(and(...conditions))
      : await db.select().from(stockItemsTable);

    return rows.map(r => ({
      ...GenericHelper.camelize<IStockItem>(r),
      photos: parsePhotos(r.photos),
    }));
  }

  async getPublicListed(): Promise<IStockItem[]> {
    const rows = await db
      .select()
      .from(stockItemsTable)
      .where(
        and(
          eq(stockItemsTable.visibility, "listed"),
          eq(stockItemsTable.availability, "available")
        )
      );
    return rows.map(r => ({
      ...GenericHelper.camelize<IStockItem>(r),
      photos: parsePhotos(r.photos),
    }));
  }

  async getById(id: string): Promise<IStockItem | null> {
    const rows = await db.select().from(stockItemsTable).where(eq(stockItemsTable.id, id)).limit(1);
    if (!rows[0]) return null;
    return { ...GenericHelper.camelize<IStockItem>(rows[0]), photos: parsePhotos(rows[0].photos) };
  }

  async create(data: ICreateStockItem): Promise<IStockItem> {
    const qty = data.quantity ?? 0;
    const row = await db
      .insert(stockItemsTable)
      .values({
        id: GenericHelper.generateUUID(),
        category: data.category,
        title: data.title,
        description: data.description,
        condition: data.condition,
        quantity: qty,
        availability: computeAvailability(qty),
        visibility: data.visibility ?? "listed",
        location_bucket: data.locationBucket,
        clothing_type: data.clothingType,
        clothing_age_group: data.clothingAgeGroup,
        gender_fit: data.genderFit,
        book_type: data.bookType,
        education_level: data.educationLevel,
        subject: data.subject,
        photos: serializePhotos(data.photos ?? []),
        source: data.source ?? "admin",
        contribution_id: data.contributionId,
      })
      .returning();
    return { ...GenericHelper.camelize<IStockItem>(row[0]), photos: parsePhotos(row[0].photos) };
  }

  async update(id: string, data: IUpdateStockItem): Promise<IStockItem | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const newQty = data.quantity ?? existing.quantity;
    const updated = await db
      .update(stockItemsTable)
      .set({
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.condition && { condition: data.condition }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.quantity !== undefined && { availability: computeAvailability(newQty) }),
        ...(data.availability && { availability: data.availability }),
        ...(data.visibility && { visibility: data.visibility }),
        ...(data.locationBucket !== undefined && { location_bucket: data.locationBucket }),
        ...(data.clothingType !== undefined && { clothing_type: data.clothingType }),
        ...(data.clothingAgeGroup !== undefined && { clothing_age_group: data.clothingAgeGroup }),
        ...(data.genderFit !== undefined && { gender_fit: data.genderFit }),
        ...(data.bookType !== undefined && { book_type: data.bookType }),
        ...(data.educationLevel !== undefined && { education_level: data.educationLevel }),
        ...(data.subject !== undefined && { subject: data.subject }),
        ...(data.photos !== undefined && { photos: serializePhotos(data.photos) }),
        updated_at: new Date(),
      })
      .where(eq(stockItemsTable.id, id))
      .returning();
    return { ...GenericHelper.camelize<IStockItem>(updated[0]), photos: parsePhotos(updated[0].photos) };
  }

  async adjustQuantity(id: string, delta: number): Promise<void> {
    const item = await this.getById(id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    await db
      .update(stockItemsTable)
      .set({ quantity: newQty, availability: computeAvailability(newQty), updated_at: new Date() })
      .where(eq(stockItemsTable.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(stockItemsTable).where(eq(stockItemsTable.id, id));
  }
}

const stockService = new StockService(db);
export { computeAvailability, parsePhotos };
export default stockService;
