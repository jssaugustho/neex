//core
import Authentication from "../core/Authentication/Authentication.js";
import Session from "../core/Session/Session.js";
import User from "../core/User/User.js";

//response & errors
import errors from "../errors/errors.js";
import response from "../response/response.js";

//types
import { Response, NextFunction } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import IpType from "../types/IpType/IpType.js";
import { Session as iSession, User as iUser } from "@prisma/client";

//validators
import EmailType from "../types/EmailType/EmailType.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import FingerprintType from "../types/FingerprintType/FingerprintType.js";
import TokenType from "../types/TokenType/TokenType.js";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";

//observers
import IncrementSessionAttempts from "../observers/SessionAttempts/IncrementSessionAttempts.js";

//db
import prisma from "../controllers/db.controller.js";
import Email from "../core/Email/Email.js";
import Verification from "../core/Verification/Verification.js";
import iSessionAttempts from "../@types/iSessionAttempt/iSessionAttempt.js";
import Token from "../core/Token/Token.js";
import iTokenPayload from "../@types/iTokenPayload/iTokenPayload.js";

async function validateResend(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session error");

  let email = new EmailType(req.body.email, req.session.locale).getValue();

  req.userData = await User.getUserByEmail(email).catch((err) => {
    throw new errors.UserError(response.emailNotExists());
  });

  req.data.timeLeft = await Verification.getTimeLeft(
    req.session,
    req.userData
  ).catch((err) => {
    throw err;
  });

  const minutes = new Date(req.data.timeLeft).getMinutes();
  const seconds = new Date(req.data.timeLeft).getSeconds();
  const hours = new Date(req.data.timeLeft).getHours();

  req.data.pretty = `${minutes}m ${seconds}s`;

  if (hours >= 1) req.data.pretty = `${hours}h ${minutes}m ${seconds}s`;

  if (req.data.timeLeft <= 0) {
    next();
  } else {
    res.status(400).send({
      status: "UserError",
      message: response.waitVerificationCode(),
      info: {
        timeLeft: req.data.timeLeft,
        pretty: req.data.pretty,
      },
    });
  }
}

async function sendEmail(req: iRequest, res: Response, next: NextFunction) {
  if (!req.userData) throw new errors.UserError("UserData Error");
  if (!req.session) throw new errors.UserError("Session Error");

  const verification = await Verification.generate2faLink(
    req.userData,
    req.session
  ).catch((err) => {
    throw err;
  });

  req.session = await prisma.session.update({
    where: {
      id: req.session.id,
    },
    data: {
      exponencialEmailExpires: {
        increment: 1,
      },
    },
  });

  let timeLeft = Verification.getExponencialTime(req.session);

  let minutes = new Date(timeLeft).getMinutes();
  let seconds = new Date(timeLeft).getSeconds();
  let hours = new Date(timeLeft).getHours();

  let pretty = `${minutes}m ${seconds}s`;

  if (hours >= 1) pretty = `${hours}h ${minutes}m ${seconds}s`;

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: "Email enviado.",
      info: {
        timeLeft,
        pretty,
      },
    },
  };

  next();
}

async function validateEmailToken(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

  const token = new TokenType(req.body.token, req.session.locale).getValue();

  req.userData = (await Verification.verify2faToken(token, req.session).catch(
    (err) => {
      throw err;
    }
  )) as iUser;

  next();
}

export default {
  validateEmailToken,
  validateResend,
  sendEmail,
};
