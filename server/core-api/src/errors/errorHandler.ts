import { NextFunction, Response } from "express";
import RequestUserPayload from "../@types/iRequest/iRequest.js";
import Core from "../core/core.js";

const { Logger } = Core;

function errorHandler(
  err: any,
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 502;

  if (err.name === "UserError") {
    statusCode = 400;
  }

  if (err.name === "TokenError") {
    statusCode = 401;
  }

  if (err.name === "SessionError") {
    statusCode = 401;
  }

  if (err.name === "AuthError") {
    statusCode = 401;
  }

  let message = err.message;

  if (statusCode === 502)
    message =
      process.env.NODE_ENV === "production" ? "Erro interno." : err.message;

  Logger.error({
    method: req.method,
    url: req.originalUrl,
    ip: req.ipLookup?.address || "unkown",
    session: req.session?.id || "unkown",
    status: err.name,
    message: err.message,
    body: req.body,
    query: req.query,
    headers: req.headers,
  });

  res.status(statusCode).send({
    status: err.name,
    message,
  });

  next();
}

export default errorHandler;
