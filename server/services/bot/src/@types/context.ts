import { User as iUser } from "@prisma/client";
import { SupportedLocales } from "../libs/i18n.js";
import { iLeadPayload } from "packages/core/src/core/Lead/Lead.js";
import { iSellerPayload } from "packages/core/src/core/Seller/Seller.js";
import { iAccountPayload } from "packages/core/src/core/Account/Account.js";
import { iProductPayload } from "packages/core/src/core/Product/Product.js";
import { iTelegramBotPayload } from "packages/core/src/core/TelegramBot/TelegramBot.js";

type LeadState = {
  requestId: string;
  telegramId: string;
  telegramBot: iTelegramBotPayload;
  locale: SupportedLocales;
  currency: string;
  slug: string;
  lead: iLeadPayload;
  product?: iProductPayload;
  account: iAccountPayload;
  seller: iSellerPayload;
  user: iUser;
};

export default LeadState;
