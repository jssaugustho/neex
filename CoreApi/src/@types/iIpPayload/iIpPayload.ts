import { Attempt, Ip, User } from "@prisma/client";

interface IIpPayload extends Ip {
  attempt: Attempt[];
  authorizedUsers: User[];
}

export default IIpPayload;
