import { PrismaClient } from "@prisma/client/extension";
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

function LuxCRMCore() {
  return {
    Authentication: Authentication,
    Session: Session,
    Token: Token,
    Email: Email,
    User: User,
    Ip: Ip,
    Verification: Verification,
    Cryptography: Cryptography,
    Prisma: Prisma,
    Logger: Logger,
  };
}

export default LuxCRMCore;
