import db, { DB } from "../../../../config/db";
import { contributionsTable } from "../../../../config/db/schemas/Contribution";
import { contributionItemsTable } from "../../../../config/db/schemas/ContributionItem";
import { stockItemsTable } from "../../../../config/db/schemas/StockItem";
import { GenericHelper } from "../../../../utils/helpers/generic.helpers";
import {
  IApproveContributionItem,
  IContribution,
  ICreateContribution,
  IUpdateContributionAdmin,
  IUpdateContributionStatus,
} from "../types";
import { eq, and, SQL } from "drizzle-orm";
import { sendEmail } from "../../../../config/queue";
import {
  contributionConfirmationEmail,
  contributionStatusEmail,
} from "../../../../utils/helpers/emailTemplates/contributionEmails";
import { computeAvailability } from "../../stock/service";

function generateCode(): string {
  return `DON-${GenericHelper.generateRandomNumber(6)}`;
}

function parsePhotos(raw: string | null | undefined): string[] {
  return raw ? raw.split(",").filter(Boolean) : [];
}

class ContributionsService {
  constructor(private readonly db: DB) {}

  private async attachItems(contribution: any): Promise<IContribution> {
    const items = await db
      .select()
      .from(contributionItemsTable)
      .where(eq(contributionItemsTable.contribution_id, contribution.id));
    return {
      ...GenericHelper.camelize<IContribution>(contribution),
      items: items.map(i => ({ ...GenericHelper.camelize(i), photos: parsePhotos(i.photos) })),
    };
  }

  async getAll(filter: { status?: string; category?: string } = {}): Promise<IContribution[]> {
    const conditions: SQL[] = [];
    if (filter.status) conditions.push(eq(contributionsTable.status, filter.status));
    if (filter.category) conditions.push(eq(contributionsTable.category, filter.category));

    const rows = conditions.length
      ? await db.select().from(contributionsTable).where(and(...conditions))
      : await db.select().from(contributionsTable);

    return Promise.all(rows.map(r => this.attachItems(r)));
  }

  async getById(id: string): Promise<IContribution | null> {
    const rows = await db.select().from(contributionsTable).where(eq(contributionsTable.id, id)).limit(1);
    if (!rows[0]) return null;
    return this.attachItems(rows[0]);
  }

  async create(data: ICreateContribution): Promise<IContribution> {
    const id = GenericHelper.generateUUID();
    const code = generateCode();

    await db.insert(contributionsTable).values({
      id,
      code,
      category: data.category,
      status: "submitted",
      donor_name: data.donorName,
      email: data.email,
      phone: data.phone,
      contact_channel: data.contactChannel,
      location: data.location,
      handover_method: data.handoverMethod,
    });

    if (data.items?.length) {
      await db.insert(contributionItemsTable).values(
        data.items.map(item => ({
          id: GenericHelper.generateUUID(),
          contribution_id: id,
          type: item.type,
          quantity: item.quantity,
          condition: item.condition,
          photos: (item.photos ?? []).join(","),
          details: item.details ?? null,
        }))
      );
    }

    const email = contributionConfirmationEmail(data.donorName, code);
    await sendEmail({ to: data.email, subject: email.subject, html: email.html });

    return this.getById(id) as Promise<IContribution>;
  }

  async updateStatus(id: string, data: IUpdateContributionStatus): Promise<IContribution | null> {
    const contribution = await this.getById(id);
    if (!contribution) return null;

    await db
      .update(contributionsTable)
      .set({ status: data.status, updated_at: new Date() })
      .where(eq(contributionsTable.id, id));

    const notifyStatuses = ["scheduled", "received", "completed", "declined"];
    if (notifyStatuses.includes(data.status)) {
      const email = contributionStatusEmail(contribution.donorName, contribution.code, data.status);
      await sendEmail({ to: contribution.email, subject: email.subject, html: email.html });
    }

    return this.getById(id);
  }

  async updateAdmin(id: string, data: IUpdateContributionAdmin): Promise<IContribution | null> {
    await db
      .update(contributionsTable)
      .set({
        ...(data.internalNotes !== undefined && { internal_notes: data.internalNotes }),
        ...(data.assignedTimeBlockId !== undefined && { assigned_time_block_id: data.assignedTimeBlockId }),
        updated_at: new Date(),
      })
      .where(eq(contributionsTable.id, id));
    return this.getById(id);
  }

  // Convert contribution items into stock, mark contribution as completed
  async approve(
    id: string,
    itemMetadata: IApproveContributionItem[]
  ): Promise<IContribution | null> {
    const contribution = await this.getById(id);
    if (!contribution || !contribution.items?.length) return null;

    for (const item of contribution.items) {
      const meta = itemMetadata.find(m => m.itemId === item.id);
      const stockId = GenericHelper.generateUUID();
      const qty = item.quantity;

      // Build a sensible auto-title if none provided
      const autoTitle = [
        contribution.category === "clothing" ? meta?.clothingType : meta?.bookType,
        meta?.educationLevel,
        `×${qty}`,
      ]
        .filter(Boolean)
        .join(" – ");

      await db.insert(stockItemsTable).values({
        id: stockId,
        category: contribution.category,
        title: meta?.title || autoTitle || `${contribution.category} item`,
        condition: item.condition,
        quantity: qty,
        availability: computeAvailability(qty),
        visibility: "listed",
        clothing_type: meta?.clothingType,
        clothing_age_group: meta?.clothingAgeGroup,
        gender_fit: meta?.genderFit,
        book_type: meta?.bookType,
        education_level: meta?.educationLevel,
        subject: meta?.subject,
        photos: (item.photos ?? []).join(","),
        source: "contribution",
        contribution_id: id,
      });
    }

    await db
      .update(contributionsTable)
      .set({ status: "completed", updated_at: new Date() })
      .where(eq(contributionsTable.id, id));

    const email = contributionStatusEmail(contribution.donorName, contribution.code, "completed");
    await sendEmail({ to: contribution.email, subject: email.subject, html: email.html });

    return this.getById(id);
  }

  async getByCode(code: string): Promise<IContribution | null> {
    const rows = await db
      .select()
      .from(contributionsTable)
      .where(eq(contributionsTable.code, code.toUpperCase().trim()))
      .limit(1);
    if (!rows[0]) return null;
    return this.attachItems(rows[0]);
  }
}

const contributionsService = new ContributionsService(db);
export default contributionsService;
