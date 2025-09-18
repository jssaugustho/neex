//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";

//db
import { getMessage } from "../../locales/getMessage.js";
import Core from "../../core/core.js";

const { Prisma } = Core;

class EmailType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;
  locale: string;

  constructor(email: string, locale: string) {
    this.locale = locale;

    if (!email)
      throw new errors.UserError(getMessage("obrigatoryParams", locale));

    if (!this.regex.test(email) || typeof email != "string")
      throw new errors.UserError(getMessage("invalidParams", locale));

    this.value = email;
  }

  avaible(): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      //query user data
      let findEmail = await Prisma.user
        .findUnique({
          where: {
            email: this.value,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError(
              "Cannot verify disponibility of email."
            )
          );
        });

      //verify if email exists
      if (findEmail) {
        return reject(
          new errors.UserError(getMessage("emailInUse", this.locale))
        );
      }

      //check if email exists
      resolve(true);
    });
  }

  getValue() {
    return this.value;
  }
}

export default EmailType;
