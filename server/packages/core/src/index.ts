import Authentication from "./core/Authentication/Authentication.js";
import Session from "./core/Session/Session.js";
import Ip from "./core/Ip/Ip.js";
import Token from "./core/Token/Token.js";
import Verification from "./core/Verification/Verification.js";
import Cryptography from "./core/Cryptography/Cryptography.js";
import Email from "./core/Email/Email.js";
import User from "./core/User/User.js";
import Prisma from "./core/Prisma/Prisma.js";
import Logger from "./core/Logger/Logger.js";
import Lead from "./core/Lead/Lead.js";
import TelegramBot from "./core/TelegramBot/TelegramBot.js";
import Product from "./core/Product/Product.js";
import Seller from "./core/Seller/Seller.js";
import PagarMe from "./core/PagarMe/PagarMe.js";
import StripePayments from "./core/StripePayments/StripePayments.js";
import Account from "./core/Account/Account.js";
import TelegramUser from "./core/TelegramUser/TelegramUser.js";
import Errors from "./core/Error/Errors.js";
import ManagementBot from "./core/ManagementBot/ManagementBot.js";
import { config } from "dotenv";

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export function Neex() {
  return {
    Account,
    Authentication,
    Session,
    Token,
    Email,
    User,
    Ip,
    Verification,
    Cryptography,
    Prisma,
    Lead,
    TelegramBot,
    TelegramUser,
    Product,
    Seller,
    PagarMe,
    StripePayments,
    ManagementBot,
    Errors,
    Logger,
    Date,
  };
}

export default Neex();
