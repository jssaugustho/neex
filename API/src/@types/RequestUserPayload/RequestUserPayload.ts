import { Request } from "express";

//types
import { User } from "@prisma/client";
import { ObjectId } from "mongoose";
import TokenPayload from "../TokenPayload/TokenPayload.js";

interface RequestUserPayload extends Request {
  userData?: User | null;
  sessionId?: string | null;
  tokenPayload?: TokenPayload;
  deleteSession?: string;
}

export default RequestUserPayload;
