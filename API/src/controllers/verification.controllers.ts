//types
import iRequest from "../@types/iRequest/iRequest.js";
import { NextFunction, Response } from "express";
import errors from "../errors/errors.js";

async function response(req: iRequest, res: Response, next: NextFunction) {
  if (!req.response?.statusCode && !req.response?.output)
    throw new errors.InternalServerError("Sem resposta.");

  res.status(req.response?.statusCode).send(req.response?.output);
}

export default {
  response,
};
