//types
import { NextFunction, Response } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import Core from "../core/core.js";
import session from "../routes/session.route.js";

const { Logger } = Core;

async function httpLogs(req: iRequest, res: Response, next: NextFunction) {
  if (!req.ipLookup) throw new Error("IP lookup not found in request logger");
  if (!req.session) throw new Error("Session not found in request logger");

  Logger.info(
    {
      method: req.method,
      url: req.originalUrl,
      ip: req.ipLookup.address,
      session: req.session.id,
      body: req.body,
      query: req.query,
      headers: req.headers,
    },
    "Request received"
  );

  next();
}

export default httpLogs;
