import { Context } from "telegraf";

import { Prisma as iPrisma, Seller as iSeller } from "@prisma/client";
import { SupportedLocales } from "../libs/i18n.js";
import { iLeadPayload } from "packages/core/src/core/Lead/Lead.js";
import { iSellerPayload } from "packages/core/src/core/Seller/Seller.js";
import { iAccountPayload } from "packages/core/src/core/Account/Account.js";
import { iProductPayload } from "packages/core/src/core/Product/Product.js";

type LeadState = {
  requestId: string;
  telegramId: string;
  locale: SupportedLocales;
  currency: string;
  lead: iLeadPayload;
  product?: iProductPayload;
  account: iAccountPayload;
  seller: iSellerPayload;
};

export default LeadState;
