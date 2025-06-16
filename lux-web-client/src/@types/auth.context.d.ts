import { AxiosInstance } from "axios";

declare interface iAuthContext {
  session: iSession;
  api: AxiosInstance;
  initializeSession: (user: iUser, sessionId: string) => void;
  endSession: () => void;
  changeTheme: () => void;
}
