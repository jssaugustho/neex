import iValidateString from "../../@types/iValidateString/iValidateString.js";
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

class FingerprintType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(fingerprint: string) {
    if (!fingerprint || typeof fingerprint != "string")
      throw new errors.AuthError(response.needFingerprintHeader());
    this.value = fingerprint;
    this.validate();
  }

  validate() {
    if (this.value.length > 128 || this.value.length < 8)
      throw new errors.AuthError(response.needFingerprintHeader());
  }

  getValue(): string {
    return this.value;
  }
}

export default FingerprintType;
