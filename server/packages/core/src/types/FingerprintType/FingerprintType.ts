import iValidateString from "../../@types/iValidateString/iValidateString.js";
import errors from "../../errors/errors.js";
import { getMessage } from "../../lib/getMessage.js";

class FingerprintType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;
  locale: string = "pt-BR";

  constructor(fingerprint: string, locale: string) {
    this.locale = locale;

    if (!fingerprint)
      throw new errors.AuthError(getMessage("obrigatoryHeaders", locale));

    if (typeof fingerprint != "string")
      throw new errors.AuthError(getMessage("invalidHeaders", locale));

    this.value = fingerprint;
    this.validate();
  }

  validate() {
    if (this.value.length > 128 || this.value.length < 8)
      throw new errors.AuthError(getMessage("invalidHeaders", this.locale));
  }

  getValue(): string {
    return this.value;
  }
}

export default FingerprintType;
