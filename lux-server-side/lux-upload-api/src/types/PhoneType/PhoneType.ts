import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errorss
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

import Core from "../../core/core.js";

const { Prisma } = Core;

class PhoneType implements iValidateString {
  regex = /^\(?\d{2}\)?\s?(?:9\d{4}|\d{4})-?\d{4}$/;
  onlyNumbers: string = "";
  pretty: string = "";
  value: string = "";
  locale = "pt-BR";

  //get phone value exactly
  constructor(phone: string, locale: string) {
    if (!phone)
      throw new errors.UserError(getMessage("obrigatoryParams", locale));

    this.locale = locale;
    this.value = phone;
    this.onlyNumbers = this.validateOnlyNumbers(phone);
    this.pretty = this.prettify();
  }

  validateOnlyNumbers(phone: string): string {
    const match = phone.match(this.regex);

    if (!match)
      throw new errors.UserError(getMessage("invalidParams", this.locale));

    return match[0];
  }

  prettify(): string {
    if (this.onlyNumbers.length === 11) {
      return `(${this.onlyNumbers.slice(0, 2)}) ${this.onlyNumbers.slice(
        2,
        7
      )}-${this.onlyNumbers.slice(7)}`;
    } else if (this.onlyNumbers.length === 10) {
      return `(${this.onlyNumbers.slice(0, 2)}) ${this.onlyNumbers.slice(
        2,
        6
      )}-${this.onlyNumbers.slice(6)}`;
    } else {
      throw new errors.UserError(getMessage("invalidParams", this.locale));
    }
  }

  avaible(): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      //query user data
      let findEmail = await Prisma.user
        .findUnique({
          where: {
            phone: this.pretty,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError(
              "Cannot verify disponibility of phone."
            )
          );
        });

      //verify if email exists
      if (findEmail) {
        return reject(
          new errors.UserError(getMessage("phoneInUse", this.locale))
        );
      }

      //check if email exists
      resolve(true);
    });
  }

  getOnlyNumbers(): string {
    return this.onlyNumbers;
  }

  getValue(): string {
    return this.pretty;
  }
}

export default PhoneType;
