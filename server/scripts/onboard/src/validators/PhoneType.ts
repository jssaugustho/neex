import Neex from "@neex/core";

const { Prisma } = Neex();

class PhoneType {
  regex = /^\(?\d{2}\)?\s?(?:9\d{4}|\d{4})-?\d{4}$/;
  onlyNumbers: string = "";
  pretty: string = "";
  value: string = "";
  valid = true;

  //get phone value exactly
  constructor(phone: string) {
    if (!phone) this.valid = false;
    this.value = phone;
    this.onlyNumbers = this.validateOnlyNumbers(phone);
    this.pretty = this.prettify();
  }

  validateOnlyNumbers(phone: string): string {
    const match = phone.match(this.regex);

    if (!match) {
      this.valid = false;
      return "";
    }

    return match[0];
  }

  prettify(): string {
    if (this.onlyNumbers.length === 11) {
      return `(${this.onlyNumbers.slice(0, 2)}) ${this.onlyNumbers.slice(
        2,
        7,
      )}-${this.onlyNumbers.slice(7)}`;
    } else if (this.onlyNumbers.length === 10) {
      return `(${this.onlyNumbers.slice(0, 2)}) ${this.onlyNumbers.slice(
        2,
        6,
      )}-${this.onlyNumbers.slice(6)}`;
    } else {
      this.valid = false;
      return "";
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
