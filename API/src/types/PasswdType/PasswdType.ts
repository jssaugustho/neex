//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//core
import Cryptography from "../../core/Cryptography/Cryptography.js";

class PasswdType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(passwd: string) {
    if (!passwd || typeof passwd != "string")
      throw new errors.UserError(response.obrigatoryParam("passwd"));

    if (passwd.length < 8 || passwd.length > 64)
      throw new errors.UserError(response.invalidPasswdLength(8, 64));

    //verify passwd sec with regex
    let validate = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

    if (!validate.test(passwd)) throw new errors.UserError("Senha fraca.");

    this.value = Cryptography.encrypt(passwd);
  }

  getValue() {
    return this.value;
  }
}

export default PasswdType;
