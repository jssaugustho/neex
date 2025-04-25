import geoip, { Lookup } from "geoip-lite";
import iLookup from "../../@types/iLookup/iLookup.js";
import iValidateString from "../../@types/iValidateString/iValidateString.js";
import errors from "../../errors/errors.js";

class IpType implements iValidateString {
  regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  value: string = "";
  location: Lookup | null;

  //get ip value exactly
  constructor(ip: string) {
    this.value = this.validate(ip);
    this.location = null;
  }

  validate(ip: string) {
    if (ip === "::1") return "181.222.238.9";

    const match = ip.match(this.regex);

    if (!match) throw new errors.InternalServerError("Invalid IP address.");

    if (match[0] === "127.0.0.1") return "181.222.238.8";

    return match[0];
  }

  getLookup(): iLookup {
    this.location = geoip.lookup(this.value);

    if (!this.location)
      this.location = {
        range: [0, 0],
        country: "BR",
        region: "BR",
        eu: "0",
        timezone: "Desconhecido",
        city: "Desconhecido",
        ll: [0, 0],
        metro: 0,
        area: 0,
      };

    return {
      ip: this.value,
      location: this.location,
    };
  }

  getValue(): string {
    return this.value;
  }
}

export default IpType;
