import { resetPasswordTokensTable } from "./PasswordReset";
import { usersTable } from "./User";
import { stockItemsTable } from "./StockItem";
import { requestsTable } from "./Request";
import { requestItemsTable } from "./RequestItem";
import { contributionsTable } from "./Contribution";
import { contributionItemsTable } from "./ContributionItem";
import { timeBlocksTable } from "./TimeBlock";
import { adminUsersTable } from "./AdminUser";

const schemas = {
  users: usersTable,
  resetPasswordTokens: resetPasswordTokensTable,
  stockItems: stockItemsTable,
  requests: requestsTable,
  requestItems: requestItemsTable,
  contributions: contributionsTable,
  contributionItems: contributionItemsTable,
  timeBlocks: timeBlocksTable,
  adminUsers: adminUsersTable,
};

export default schemas;