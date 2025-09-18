//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

class TokenType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(text: string, locale: string) {
    if (!text) throw new errors.AuthError(getMessage("invalidToken", locale));

    if (typeof text != "string")
      throw new errors.AuthError(getMessage("invalidToken", locale));

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default TokenType;
