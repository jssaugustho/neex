//types
import { isValidObjectId } from "mongoose";
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";
import { getMessage } from "../../locales/getMessage.js";

class BooleanType {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: boolean;

  constructor(text: boolean) {
    if (!text) throw new errors.UserError(getMessage("obrigatoryParams"));

    if (typeof text != "boolean")
      throw new errors.UserError(getMessage("invalidParams"));

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default BooleanType;
