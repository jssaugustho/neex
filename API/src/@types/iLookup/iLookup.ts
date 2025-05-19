import { Lookup } from "geoip-lite";

interface iLookup {
  ip: string;
  city: string;
  region: string;
  country: string;
  timezone: string;
  ll: number[];
}

export default iLookup;
