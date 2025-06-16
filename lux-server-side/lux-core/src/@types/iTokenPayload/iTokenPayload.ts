import { JwtPayload } from "jsonwebtoken";

interface iTokenPayload extends JwtPayload {
  id?: string;
  sessionId?: string;
}

export default iTokenPayload;
