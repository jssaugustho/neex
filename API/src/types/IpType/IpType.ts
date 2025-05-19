import geoip, { Lookup } from "geoip-lite";
import iLookup from "../../@types/iLookup/iLookup.js";
import iValidateString from "../../@types/iValidateString/iValidateString.js";
import errors from "../../errors/errors.js";

class IpType implements iValidateString {
  regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  value: string = "";
  location: Lookup | null;

  //get ip value exactly
  constructor(ip: string, locale: string) {
    this.value = this.validate(ip);
    this.location = null;
  }

  validate(ip: string) {
    if (process.env.NODE_ENV === "development") return "187.94.56.100";

    const match = ip.match(this.regex);

    if (!match)
      throw new errors.InternalServerError("Ip not matched with validation..");

    return match[0];
  }

  getLookup(): iLookup {
    let lookup = geoip.lookup(this.value);

    return {
      ip: this.value,
      city: lookup?.city || "São Paulo",
      region: lookup?.region || "SP",
      country: lookup?.country || "BR",
      timezone: lookup?.timezone || "America/Sao_Paulo",
      ll: lookup?.ll || [-23.5505, -46.6333],
    };
  }

  getValue(): string {
    return this.value;
  }
}

export default IpType;
