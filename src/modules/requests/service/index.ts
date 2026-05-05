import db, { DB } from "../../../../config/db";
import { requestsTable } from "../../../../config/db/schemas/Request";
import { requestItemsTable } from "../../../../config/db/schemas/RequestItem";
import { stockItemsTable } from "../../../../config/db/schemas/StockItem";
import { GenericHelper } from "../../../../utils/helpers/generic.helpers";
import {
  ICreateRequest,
  IRequest,
  IRequestFilter,
  IUpdateRequestAdmin,
  IUpdateRequestStatus,
} from "../types";
import { eq, and, ilike, or, SQL } from "drizzle-orm";
import { sendEmail } from "../../../../config/queue";
import {
  requestConfirmationEmail,
  requestStatusEmail,
} from "../../../../utils/helpers/emailTemplates/requestEmails";
import { computeAvailability } from "../../stock/service";

function generateCode(): string {
  return `REQ-${GenericHelper.generateRandomNumber(6)}`;
}

class RequestsService {
  constructor(private readonly db: DB) {}

  private async attachItems(request: any): Promise<IRequest> {
    const items = await db
      .select()
      .from(requestItemsTable)
      .where(eq(requestItemsTable.request_id, request.id));
    return { ...GenericHelper.camelize<IRequest>(request), items: items.map(i => GenericHelper.camelize(i)) };
  }

  async getAll(filter: IRequestFilter = {}): Promise<IRequest[]> {
    const conditions: SQL[] = [];
    if (filter.status) conditions.push(eq(requestsTable.status, filter.status));
    if (filter.type) conditions.push(eq(requestsTable.type, filter.type));
    if (filter.handoverMethod) conditions.push(eq(requestsTable.handover_method, filter.handoverMethod));
    if (filter.search) {
      conditions.push(
        or(
          ilike(requestsTable.requester_name, `%${filter.search}%`),
          ilike(requestsTable.code, `%${filter.search}%`),
          ilike(requestsTable.location, `%${filter.search}%`)
        ) as SQL
      );
    }

    const rows = conditions.length
      ? await db.select().from(requestsTable).where(and(...conditions))
      : await db.select().from(requestsTable);

    return Promise.all(rows.map(r => this.attachItems(r)));
  }

  async getById(id: string): Promise<IRequest | null> {
    const rows = await db.select().from(requestsTable).where(eq(requestsTable.id, id)).limit(1);
    if (!rows[0]) return null;
    return this.attachItems(rows[0]);
  }

  async create(data: ICreateRequest): Promise<IRequest> {
    const id = GenericHelper.generateUUID();
    const code = generateCode();

    await db.insert(requestsTable).values({
      id,
      code,
      type: data.type,
      status: "submitted",
      requester_name: data.requesterName,
      email: data.email,
      phone: data.phone,
      contact_channel: data.contactChannel,
      location: data.location,
      handover_method: data.handoverMethod,
      beneficiary_age_group: data.beneficiaryAgeGroup,
      beneficiary_gender: data.beneficiaryGender,
      org_name: data.orgName,
      beneficiary_count: data.beneficiaryCount,
      contact_status: "not-contacted",
    });

    if (data.items?.length) {
      await db.insert(requestItemsTable).values(
        data.items.map(item => ({
          id: GenericHelper.generateUUID(),
          request_id: id,
          stock_item_id: item.stockItemId,
          quantity: item.quantity,
        }))
      );
    }

    const email = requestConfirmationEmail(data.requesterName, code);
    await sendEmail({ to: data.email, subject: email.subject, html: email.html });

    return this.getById(id) as Promise<IRequest>;
  }

  async updateStatus(id: string, data: IUpdateRequestStatus): Promise<IRequest | null> {
    const request = await this.getById(id);
    if (!request) return null;

    await db
      .update(requestsTable)
      .set({
        status: data.status,
        ...(data.declineReason && { decline_reason: data.declineReason }),
        updated_at: new Date(),
      })
      .where(eq(requestsTable.id, id));

    // Decrement stock when fulfilled
    if (data.status === "fulfilled" && request.items?.length) {
      for (const item of request.items) {
        const stockRows = await db
          .select()
          .from(stockItemsTable)
          .where(eq(stockItemsTable.id, item.stockItemId))
          .limit(1);
        if (stockRows[0]) {
          const newQty = Math.max(0, stockRows[0].quantity - item.quantity);
          await db
            .update(stockItemsTable)
            .set({ quantity: newQty, availability: computeAvailability(newQty), updated_at: new Date() })
            .where(eq(stockItemsTable.id, item.stockItemId));
        }
      }
    }

    // Notify requester
    const notifyStatuses = ["processing", "ready-to-schedule", "scheduled", "fulfilled", "waitlisted", "declined"];
    if (notifyStatuses.includes(data.status)) {
      const email = requestStatusEmail(request.requesterName, request.code, data.status);
      await sendEmail({ to: request.email, subject: email.subject, html: email.html });
    }

    return this.getById(id);
  }

  async updateAdmin(id: string, data: IUpdateRequestAdmin): Promise<IRequest | null> {
    await db
      .update(requestsTable)
      .set({
        ...(data.contactStatus && { contact_status: data.contactStatus }),
        ...(data.internalNotes !== undefined && { internal_notes: data.internalNotes }),
        ...(data.assignedVolunteer !== undefined && { assigned_volunteer: data.assignedVolunteer }),
        ...(data.assignedTimeBlockId !== undefined && { assigned_time_block_id: data.assignedTimeBlockId }),
        updated_at: new Date(),
      })
      .where(eq(requestsTable.id, id));
    return this.getById(id);
  }

  async getByCode(code: string): Promise<IRequest | null> {
    const rows = await db
      .select()
      .from(requestsTable)
      .where(eq(requestsTable.code, code.toUpperCase().trim()))
      .limit(1);
    if (!rows[0]) return null;
    return this.attachItems(rows[0]);
  }

  async selfSchedule(code: string, timeBlockId: string): Promise<IRequest | null> {
    const rows = await db
      .select()
      .from(requestsTable)
      .where(eq(requestsTable.code, code.toUpperCase().trim()))
      .limit(1);
    if (!rows[0]) return null;
    if (rows[0].status !== "ready-to-schedule") return null;

    await db
      .update(requestsTable)
      .set({ assigned_time_block_id: timeBlockId, status: "scheduled", updated_at: new Date() })
      .where(eq(requestsTable.id, rows[0].id));

    const updated = await this.getById(rows[0].id);
    if (updated) {
      const email = requestStatusEmail(updated.requesterName, updated.code, "scheduled");
      await sendEmail({ to: updated.email, subject: email.subject, html: email.html });
    }
    return updated;
  }
}

const requestsService = new RequestsService(db);
export default requestsService;
