import Authentication from "./src/core/Authentication/Authentication.js";
import Session from "./src/core/Session/Session.js";
import Ip from "./src/core/Ip/Ip.js";
import Token from "./src/core/Token/Token.js";
import Verification from "./src/core/Verification/Verification.js";
import Cryptography from "./src/core/Cryptography/Cryptography.js";
import Email from "./src/core/Email/Email.js";
import User from "./src/core/User/User.js";
import Prisma from "./src/core/Prisma/Prisma.js";
import Logger from "./src/core/Logger/Logger.js";
import Lead from "./src/core/Lead/Lead.js";
import TelegramBot from "./src/core/TelegramBot/TelegramBot.js";
import Product from "./src/core/Product/Product.js";
import Seller from "./src/core/Seller/Seller.js";
import PagarMe from "./src/core/PagarMe/PagarMe.js";
import StripePayments from "./src/core/StripePayments/StripePayments.js";
import Account from "./src/core/Account/Account.js";
import TelegramUser from "./src/core/TelegramUser/TelegramUser.js";

function Neex() {
  return {
    Account: Account,
    Authentication: Authentication,
    Session: Session,
    Token: Token,
    Email: Email,
    User: User,
    Ip: Ip,
    Verification: Verification,
    Cryptography: Cryptography,
    Prisma: Prisma,
    Lead: Lead,
    TelegramBot: TelegramBot,
    TelegramUser,
    Product: Product,
    Seller: Seller,
    PagarMe: PagarMe,
    StripePayments: StripePayments,
    Logger: Logger,
  };
}

export default Neex;
