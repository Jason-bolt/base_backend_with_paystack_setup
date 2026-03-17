import { resetPasswordTokensTable } from "./PasswordReset";
import { usersTable } from "./User";

const schemas = {
  users: usersTable,
  resetPasswordTokens: resetPasswordTokensTable
};

export default schemas;