import { NextFunction, Response } from "express";
import RequestUserPayload from "../@types/RequestUserPayload/RequestUserPayload.js";

function errorHandler(
  err: any,
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
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

  res.status(statusCode).send({
    status: err.name,
    message: err.message,
  });

  next();
}

export default errorHandler;
