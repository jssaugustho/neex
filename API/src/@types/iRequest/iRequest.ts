import { Request } from "express";

//types
import { Session, User } from "@prisma/client";
import iResponse from "../iResponse/iResponse.js";

interface iRequest extends Request {
  userData?: User;
  session?: Session;
  deleteSession?: string | null;
  data?: any;
  response?: iResponse;
}

export default iRequest;
