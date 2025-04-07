import { Lookup } from "geoip-lite";

interface iLookup {
  ip: string;
  location: Lookup;
}

export default iLookup;
