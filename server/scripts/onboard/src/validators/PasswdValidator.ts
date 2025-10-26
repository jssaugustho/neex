import { Neex } from "@neex/core";

const { Cryptography } = Neex();

class PasswdValidator {
  value: string;
  hash: string = "";
  valid: boolean = true;

  constructor(passwd: string) {
    if (!passwd) this.valid = false;

    if (passwd.length < 8 || passwd.length > 64) this.valid = false;

    this.value = passwd;
  }

  validate() {
    //verify passwd sec with regex
    let validate = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

    if (!validate.test(this.value)) this.valid = false;

    return this.value;
  }

  async getHash() {
    this.hash = await Cryptography.hash(this.value);

    return this.hash;
  }
}

export default PasswdValidator;
