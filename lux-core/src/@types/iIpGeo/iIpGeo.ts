import { Lookup } from "geoip-lite";
import iValidateString from "../iValidateString/iValidateString.js";

interface iIpGeo {
  ip: string;
  location: Lookup | null;
}

export default iIpGeo;
