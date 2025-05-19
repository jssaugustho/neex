import { Attempt, Ip, User } from "@prisma/client";

interface IIpPayload extends Ip {
  Attempt: Attempt[];
  authorizedUsers: User[];
}

export default IIpPayload;
