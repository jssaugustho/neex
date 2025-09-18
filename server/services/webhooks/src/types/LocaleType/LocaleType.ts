//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

class LocaleType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  validate(text: string) {
    try {
      new Date().toLocaleTimeString(text);
      return true;
    } catch (err) {
      return false;
    }
  }

  constructor(text: string, locale: string) {
    if (!text)
      throw new errors.AuthError(getMessage("obrigatoryHeaders", locale));

    let errorMsg = getMessage("invalidHeaders", locale);

    if (typeof text != "string") throw new errors.AuthError(errorMsg);

    if (!this.validate(text)) throw new errors.AuthError(errorMsg);

    this.value = text;
  }

  getValue(): string {
    return this.value;
  }
}

export default LocaleType;
