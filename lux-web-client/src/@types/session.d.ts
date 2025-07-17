import { iUser } from "@/@types/user";

declare interface iSession {
  signed: boolean;
  empty?: boolean;
  remember?: boolean;
  emailVerified?: boolean;
  email?: string;
  token?: string;
  theme: "dark" | "light" | null;
}
