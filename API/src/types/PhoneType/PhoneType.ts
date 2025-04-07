import iValidateString from "../../@types/iValidateString/iValidateString.js";
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

class PhoneType implements iValidateString {
  regex = /^\(?\d{2}\)?\s?(?:9\d{4}|\d{4})-?\d{4}$/;
  onlyNumbers: string = "";
  pretty: string = "";
  value: string = "";

  //get phone value exactly
  constructor(phone: string) {
    this.value = phone;
    this.onlyNumbers = this.validateOnlyNumbers(phone);
    this.pretty = this.prettify();
  }

  validateOnlyNumbers(phone: string): string {
    const match = phone.match(this.regex);

    if (!match) throw new errors.UserError(response.invalidParam("phone"));

    return match[0];
  }

  prettify(): string {
    if (this.onlyNumbers.length === 11) {
      return `(${this.onlyNumbers.slice(0, 2)}) ${this.onlyNumbers.slice(
        2,
        7
      )}-${this.onlyNumbers.slice(7)}`;
    } else if (this.onlyNumbers.length === 10) {
      return `(${this.onlyNumbers.slice(0, 2)}) ${this.onlyNumbers.slice(
        2,
        6
      )}-${this.onlyNumbers.slice(6)}`;
    } else {
      throw new errors.UserError(response.invalidParam("phone"));
    }
  }

  getOnlyNumbers(): string {
    return this.onlyNumbers;
  }

  getValue(): string {
    return this.pretty;
  }
}

export default PhoneType;
