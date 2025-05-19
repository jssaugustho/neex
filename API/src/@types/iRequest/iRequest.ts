import { Request } from "express";

//types
import { Session, User } from "@prisma/client";
import iResponse from "../iResponse/iResponse.js";
import iSessionPayload from "../iSessionPayload/iSessionPayload.js";
import IIpPayload from "../iIpPayload/iIpPayload.js";

interface iRequest extends Request {
  userData: User;
  ipLookup: IIpPayload;
  session: iSessionPayload;
  deleteSession?: string | null;
  data?: any;
  response?: iResponse;
}

export default iRequest;
