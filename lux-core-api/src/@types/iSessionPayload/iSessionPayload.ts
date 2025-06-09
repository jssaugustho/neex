import {
  Session as iSession,
  Attempt as iAttempt,
  Ip as iIp,
} from "@prisma/client";

interface iSessionPayload extends iSession {
  ip: iIp;
}

export default iSessionPayload;
