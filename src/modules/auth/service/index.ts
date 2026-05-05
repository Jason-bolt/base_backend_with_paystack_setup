import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import db from "../../../../config/db";
import schemas from "../../../../config/db/schemas";
import envs from "../../../../config/envs";

class AuthService {
  async login(username: string, password: string) {
    const [admin] = await db
      .select()
      .from(schemas.adminUsers)
      .where(eq(schemas.adminUsers.username, username));

    if (!admin) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      envs.JWT_SECRET,
      { expiresIn: envs.JWT_TOKEN_EXPIRY as any }
    );

    return { token, username: admin.username };
  }

  async changeCredentials(
    adminId: string,
    currentPassword: string,
    newUsername?: string,
    newPassword?: string
  ) {
    const [admin] = await db
      .select()
      .from(schemas.adminUsers)
      .where(eq(schemas.adminUsers.id, adminId));

    if (!admin) throw new Error("Admin not found");

    const valid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!valid) throw new Error("Current password is incorrect");

    if (newUsername && newUsername !== admin.username) {
      const [existing] = await db
        .select()
        .from(schemas.adminUsers)
        .where(eq(schemas.adminUsers.username, newUsername));
      if (existing) throw new Error("Username already taken");
    }

    const updates: Record<string, any> = { updated_at: new Date() };
    if (newUsername) updates.username = newUsername;
    if (newPassword) updates.password_hash = await bcrypt.hash(newPassword, 10);

    const [updated] = await db
      .update(schemas.adminUsers)
      .set(updates)
      .where(eq(schemas.adminUsers.id, adminId))
      .returning();

    const newToken = jwt.sign(
      { id: updated.id, username: updated.username },
      envs.JWT_SECRET,
      { expiresIn: envs.JWT_TOKEN_EXPIRY as any }
    );

    return { username: updated.username, token: newToken };
  }

  async seed() {
    const existing = await db.select().from(schemas.adminUsers);
    if (existing.length > 0) return;
    const hash = await bcrypt.hash("password", 10);
    await db.insert(schemas.adminUsers).values({ username: "admin", password_hash: hash });
    console.log("✓ Default admin seeded — username: admin, password: password");
  }
}

const authService = new AuthService();
export default authService;
