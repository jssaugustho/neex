//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../lib/getMessage.js";
import response from "../../response/response.js";

class SmallTextType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(text: string, locale: string) {
    if (!text)
      throw new errors.UserError(getMessage("obrigatoryParams", locale));

    if (text.length > 64 || typeof text != "string")
      throw new errors.UserError(getMessage("obrigatoryParams", locale));

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default SmallTextType;
