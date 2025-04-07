//types
import { NextFunction, Response } from "express";
import iRequest from "../@types/iRequest/iRequest.js";

//db
import prisma from "./db.controller.js";

//errors
import errors from "../errors/errors.js";

async function response(req: iRequest, res: Response, next: NextFunction) {
  if (req.response)
    res.status(req.response.statusCode).send(req.response.output);
}

export default {
  response,
};
