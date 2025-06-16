//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//core
import { getMessage } from "../../locales/getMessage.js";

import Core from "../../core/core.js";

const { Cryptography } = Core;

class PasswdType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(passwd: string, locale: string, verifyPasswdForce = true) {
    if (!passwd)
      throw new errors.UserError(getMessage("obrigatoryParams", locale));

    if (passwd.length < 8 || passwd.length > 64)
      throw new errors.UserError(getMessage("wrongPassword", locale));

    //verify passwd sec with regex
    let validate = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

    if (!validate.test(passwd) && verifyPasswdForce)
      throw new errors.UserError(getMessage("easyPassword", locale));

    this.value = Cryptography.encrypt(passwd);
  }

  getValue() {
    return this.value;
  }
}

export default PasswdType;
