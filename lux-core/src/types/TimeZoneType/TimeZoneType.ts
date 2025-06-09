//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

class TimeZoneType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;
  locale: string;

  validate(tz: string) {
    try {
      new Date().toLocaleTimeString(this.locale, {
        timeZone: tz,
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  constructor(text: string, locale: string) {
    if (!text)
      throw new errors.AuthError(getMessage("obrigatoryHeaders", locale));

    if (typeof text != "string")
      throw new errors.AuthError(getMessage("invalidHeaders", locale));

    if (!this.validate(text))
      throw new errors.AuthError(getMessage("invalidHeaders", locale));

    this.locale = locale;
    this.value = text;
  }

  getValue() {
    return this.value;
  }
}

export default TimeZoneType;
