import { Session as iSession, Attempt as iAttempt } from "@prisma/client";

interface iSessionWithAttempts extends iSession {
  attempts: iAttempt[];
}

export default iSessionWithAttempts;
