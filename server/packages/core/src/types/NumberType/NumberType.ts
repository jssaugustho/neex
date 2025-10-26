//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../lib/getMessage.js";

class NumberType {
  value: number;

  constructor(text: number, locale: string) {
    if (!text)
      throw new errors.UserError(getMessage("obrigatoryParams", locale));

    if (typeof text != "number")
      throw new errors.UserError(getMessage("invalidParam", locale));

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default NumberType;
