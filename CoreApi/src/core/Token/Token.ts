//types
import iTokenPayload from "../../@types/iTokenPayload/iTokenPayload.js";

//external libs
import jwt from "jsonwebtoken";

//errors
import response from "../../response/response.js";
import errors from "../../errors/errors.js";

class Token {
  loadPayload(token: string, load = "token"): Promise<iTokenPayload> {
    return new Promise((resolve, reject) => {
      if (load === "token") {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err)
            return reject(new errors.TokenError(response.invalidToken()));
          return resolve(payload as iTokenPayload);
        });
      }
      if (load == "refreshToken") {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
          if (err)
            return reject(new errors.AuthError(response.invalidRefreshToken()));
          return resolve(payload as iTokenPayload);
        });
      }
      if (load == "emailToken") {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err)
            return reject(new errors.AuthError(response.invalidEmailToken()));
          return resolve(payload as iTokenPayload);
        });
      }
    });
  }
}

export default new Token();
