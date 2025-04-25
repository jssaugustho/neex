//types
import { isValidObjectId } from "mongoose";
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

class NumberType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(text: string) {
    if (!text) throw new errors.UserError(response.obrigatoryParam("id"));

    if (typeof text != "boolean")
      throw new errors.UserError(response.invalidParam("id"));

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default NumberType;
