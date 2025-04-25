//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

class TokenType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(text: string) {
    if (!text) throw new errors.AuthError(response.invalidToken());

    if (text.length > 1024 || typeof text != "string")
      throw new errors.AuthError(response.invalidToken());

    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default TokenType;
