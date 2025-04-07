//obrigatory for middlewares
import prisma from "../controllers/db.controller.js";
import errors from "../errors/errors.js";

//types
import iRequest from "../@types/iRequest/iRequest.js";
import { NextFunction, Response } from "express";
import Verification from "../core/Verification/Verification.js";
import { Session as iSession, User as iUser } from "@prisma/client";

//validators
import TokenType from "../types/TokenType/TokenType.js";
import User from "../core/User/User.js";
import Session from "../core/Session/Session.js";
import response from "../response/response.js";
import EmailType from "../types/EmailType/EmailType.js";

//core
import Token from "../core/Token/Token.js";

async function CheckUserVerified(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  //verfy if is verfied
  if (req.userData?.emailVerified)
    throw new errors.UserError("Email já verificado.");

  next();
}

//validate email verification code after auth
async function validateVerifyEmailParams(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.data.token = new TokenType(req.body.token as string).getValue();

  const verification = await Verification.verifyEmailToken(
    req.data.token,
    req.userData as iUser,
    true
  ).catch((err) => {
    throw err;
  });

  req.session = verification.session;

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: response.emailVerified(),
    },
  };

  next();
}

async function setEmailVerified(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  let id = req.userData?.id;

  await prisma.user
    .update({
      where: { id },
      data: { emailVerified: true },
    })
    .catch((err) => {
      throw new errors.InternalServerError(
        "Cannot update emailVerified user in DB."
      );
    });

  next();
}

//validate email verification code after auth
async function validateAuthEmailParams(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.data.token = new TokenType(req.body.token as string).getValue();

  await Verification.verifyEmailToken(
    req.data.token,
    req.userData as iUser,
    false,
    req.data.fingerprint,
    req.data.ipLookup
  ).catch((err) => {
    throw err;
  });

  next();
}

async function verifyFingerprint(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.data.token = new TokenType(req.query.token as string).getValue();

  const decoded = await Token.loadPayload(req.data.token).catch((err) => {
    throw err;
  });

  req.userData = await User.getUserById(decoded.id as string).catch((err) => {
    throw err;
  });

  console.log(decoded);

  const decodedSession = (await Session.getSessionById(
    decoded.sessionId as string
  ).catch(next)) as iSession;

  const indicators: string[] = [];

  if (req.data.figerprint !== decodedSession.fingerprint)
    indicators.push("fingerprint");

  if (req.data.ipLookup.ip !== decodedSession.ip) indicators.push("ip");

  if (indicators.length >= 2)
    throw new errors.AuthError(response.unauthorizated());

  next();
}

async function verifySendEmailAuthParams(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.data.email = new EmailType(req.body.email as string).getValue();

  req.userData = await User.getUserByEmail(req.data.email).catch((err) => {
    throw err;
  });

  req.session = await Session.createSession(
    req.userData as iUser,
    req.data.fingerprint,
    req.data.ipLookup,
    false
  );

  next();
}

async function verifyWaitTime(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

  req.data.verification = await prisma.verification
    .findUniqueOrThrow({
      where: {
        userId: req.userData?.id,
      },
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot find verification in DB.");
    });

  const waitTime = Verification.verifyTime(req.data.verification, req.session);

  if (!waitTime.approved) {
    res.status(400).send({
      status: "UserError",
      message: response.waitVerificationCode(),
      info: {
        waitTime: waitTime.time,
        timeLeft: waitTime.prettyTime,
      },
    });
  } else next();
}

async function sendEmailVerification(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userData) throw new errors.InternalServerError("UserData error.");

  Verification.generateEmailToken(req.userData, req.session as iSession)
    .then((token) => {
      req.response = {
        statusCode: 200,
        output: {
          status: "Ok",
          message: "Email enviado para: " + req.userData?.email,
        },
      };
      next();
    })
    .catch(next);
}

export default {
  verifySendEmailAuthParams,
  validateVerifyEmailParams,
  validateAuthEmailParams,
  CheckUserVerified,
  setEmailVerified,
  verifyFingerprint,
  sendEmailVerification,
  verifyWaitTime,
};
