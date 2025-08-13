//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";
import response from "../../response/response.js";

class RoleType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(text: string, locale: string) {
    if (!text)
      throw new errors.UserError(getMessage("obrigatoryParams", locale));

    if (
      (text !== "ADMIN" && text !== "USER" && text !== "SUPPORT") ||
      typeof text != "string"
    )
      throw new errors.UserError(getMessage("invalidParams", locale));

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default RoleType;
