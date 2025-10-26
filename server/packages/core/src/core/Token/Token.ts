//types
import iTokenPayload from "../../@types/iTokenPayload/iTokenPayload.js";

//external libs
import jwt from "jsonwebtoken";

import errors from "../../errors/errors.js";
import { PrismaClient } from "@prisma/client/extension";
import { getMessage } from "../../lib/getMessage.js";

class Token {
  loadPayload(
    token: string,
    load = "token",
    locale = "pt-BR",
  ): Promise<iTokenPayload> {
    return new Promise((resolve, reject) => {
      if (load === "token") {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err)
            return reject(
              new errors.TokenError(getMessage("invalidToken", locale)),
            );
          return resolve(payload as iTokenPayload);
        });
      }
      if (load == "refreshToken") {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
          if (err)
            return reject(
              new errors.AuthError(getMessage("invalidRefreshToken", locale)),
            );
          return resolve(payload as iTokenPayload);
        });
      }
      if (load == "emailToken") {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err)
            return reject(
              new errors.AuthError(getMessage("invalidToken", locale)),
            );
          return resolve(payload as iTokenPayload);
        });
      }
    });
  }
}

export default new Token();
