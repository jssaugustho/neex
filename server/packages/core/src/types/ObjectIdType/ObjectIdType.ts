//types
import { isValidObjectId } from "mongoose";
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../lib/getMessage.js";

class ObjectIdType {
  value: string;

  constructor(text: string, locale: string) {
    if (!text) throw new errors.UserError(getMessage("invalidParams", locale));

    if (typeof text != "string")
      throw new errors.UserError(getMessage("invalidParams", locale));

    if (!isValidObjectId(text))
      throw new errors.UserError(getMessage("invalidParams", locale));

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default ObjectIdType;
