import { iUser } from "@/@types/user";

declare interface iSession {
  signed: boolean;
  userId?: string;
  userName?: string;
  userLastName?: string;
  userEmail?: string;
  userEmailVerified?: boolean;
  userPhone?: string;
  sessionId?: string;
  theme: "dark" | "light" | null;
}
