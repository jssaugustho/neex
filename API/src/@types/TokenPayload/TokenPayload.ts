import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id?: string;
  sessionId?: string;
}

export default TokenPayload;
