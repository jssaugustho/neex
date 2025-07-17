import { iSession } from "@/@types/session";
import { useRouter } from "next/router";
import { AxiosInstance } from "axios";

declare interface iAuthContext {
  api: AxiosInstance;
  session: iSession;
  preAuth: (token: string) => void;
  initializeSession: (user: iUser, remember: boolean) => void;
  endSession: () => void;
  changeTheme: () => void;
}
