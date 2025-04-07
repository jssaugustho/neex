import { Session as iSession } from "@prisma/client";

interface iSessionPontuation extends iSession {
  indicators: number;
}

export default iSessionPontuation;
