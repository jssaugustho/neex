//response & errors
import errors from "../errors/errors.js";
import response from "../response/response.js";

//types
import { Response, NextFunction } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import { Session as iSession, User as iUser } from "@prisma/client";

//validators
import EmailType from "../types/EmailType/EmailType.js";
import TokenType from "../types/TokenType/TokenType.js";

//db
import { getMessage } from "../locales/getMessage.js";
import Core from "../core/core.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import Email from "@luxcrm/lux-core/src/core/Email/Email.js";

const { Verification, User, Prisma, Logger } = Core;

async function validateEmail(req: iRequest, res: Response, next: NextFunction) {
  if (!req.session) throw new errors.InternalServerError("Session error");

  let email = new EmailType(req.body.email, req.session.locale).getValue();

  req.userData = await User.getUserByEmail(email).catch((err) => {
    throw new errors.UserError(response.emailNotExists());
  });

  next();
}

async function validateIfEmailAlreadyVerified(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");
  if (!req.userData) throw new errors.InternalServerError("UserData error.");

  if (req.userData.emailVerified)
    throw new errors.UserError(
      getMessage("emailAlreadyVerified", req.session.locale),
    );

  next();
}

async function validateResend(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error");
  if (!req.userData) throw new errors.UserError("UserData Error");

  req.data.timeLeft = await Verification.getTimeLeft(
    req.session,
    req.userData,
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
    Logger.error(
      {
        email: req.userData.email,
        timeLeft: req.data.timeLeft,
        pretty: req.data.pretty,
      },
      "Wait to resend email.",
    );
    res.status(400).send({
      status: "UserError",
      message: getMessage("waitToResendEmail", req.session.locale),
      info: {
        timeLeft: req.data.timeLeft,
        pretty: req.data.pretty,
      },
    });
  }
}

async function sendAuthenticationEmail(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.userData) throw new errors.UserError("UserData Error");
  if (!req.session) throw new errors.UserError("Session Error");

  const verification = await Verification.generate2faLink(
    req.userData,
    req.session,
    "AUTHENTICATION",
  ).catch((err) => {
    throw err;
  });

  let data: any = {
    exponencialEmailExpires: {
      increment: 1,
    },
  };

  if (req.session.exponencialEmailExpires >= 12) {
    data = {
      exponencialEmailExpires: 16,
    };
  }

  req.session = await Prisma.session.update({
    where: {
      id: req.session.id,
    },
    data,
    include: {
      ip: true,
    },
  });

  let timeLeft = Verification.getExponencialTime(req.session);

  let minutes = new Date(timeLeft).getMinutes();
  let seconds = new Date(timeLeft).getSeconds();
  let hours = new Date(timeLeft).getHours();

  let pretty = `${minutes}m ${seconds}s`;

  if (hours >= 1) pretty = `${hours}h ${minutes}m ${seconds}s`;

  await Verification.sendTransacionalEmail(
    req.userData,
    verification,
    req.session,
  ).catch((err) => {
    throw new errors.InternalServerError(
      "Erro ao enviar o email de verificação.",
    );
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("sendedEmail", req.session.locale),
      info: {
        timeLeft,
        pretty,
      },
    },
  };

  next();
}

async function sendVerifySessionEmail(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.userData) throw new errors.UserError("UserData Error");
  if (!req.session) throw new errors.UserError("Session Error");

  const verification = await Verification.generate2faLink(
    req.userData,
    req.session,
    "VERIFY_SESSION",
  ).catch((err) => {
    throw err;
  });

  let data: any = {
    exponencialEmailExpires: {
      increment: 1,
    },
  };

  if (req.session.exponencialEmailExpires >= 12) {
    data = {
      exponencialEmailExpires: 16,
    };
  }

  req.session = await Prisma.session.update({
    where: {
      id: req.session.id,
    },
    data,
    include: {
      ip: true,
    },
  });

  let timeLeft = Verification.getExponencialTime(req.session);

  let minutes = new Date(timeLeft).getMinutes();
  let seconds = new Date(timeLeft).getSeconds();
  let hours = new Date(timeLeft).getHours();

  let pretty = `${minutes}m ${seconds}s`;

  if (hours >= 1) pretty = `${hours}h ${minutes}m ${seconds}s`;

  await Verification.sendTransacionalEmail(
    req.userData,
    verification,
    req.session,
  ).catch((err) => {
    throw new errors.InternalServerError(
      "Erro ao enviar o email de verificação.",
    );
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("sendedEmail", req.session.locale),
      info: {
        timeLeft,
        pretty,
      },
    },
  };

  next();
}

async function sendVerificationEmail(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.userData) throw new errors.UserError("UserData Error");
  if (!req.session) throw new errors.UserError("Session Error");

  const verification = await Verification.generate2faLink(
    req.userData,
    req.session,
    "VERIFICATION",
  ).catch((err) => {
    throw err;
  });

  let data: any = {
    exponencialEmailExpires: {
      increment: 1,
    },
  };

  if (req.session.exponencialEmailExpires >= 12) {
    data = {
      exponencialEmailExpires: 16,
    };
  }

  req.session = await Prisma.session.update({
    where: {
      id: req.session.id,
    },
    data,
    include: {
      ip: true,
    },
  });

  let timeLeft = Verification.getExponencialTime(req.session);

  let minutes = new Date(timeLeft).getMinutes();
  let seconds = new Date(timeLeft).getSeconds();
  let hours = new Date(timeLeft).getHours();

  let pretty = `${minutes}m ${seconds}s`;

  if (hours >= 1) pretty = `${hours}h ${minutes}m ${seconds}s`;

  await Verification.sendTransacionalEmail(
    req.userData,
    verification,
    req.session,
  ).catch((err) => {
    throw new errors.InternalServerError(
      "Erro ao enviar o email de verificação.",
    );
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("sendedEmail", req.session.locale),
      info: {
        timeLeft,
        pretty,
      },
    },
  };

  next();
}

async function sendRecoveryEmail(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.userData) throw new errors.UserError("UserData Error");
  if (!req.session) throw new errors.UserError("Session Error");

  const verification = await Verification.generate2faLink(
    req.userData,
    req.session,
    "RECOVERY",
  ).catch((err) => {
    throw err;
  });

  let data: any = {
    exponencialEmailExpires: {
      increment: 1,
    },
  };

  if (req.session.exponencialEmailExpires >= 12) {
    data = {
      exponencialEmailExpires: 16,
    };
  }

  req.session = await Prisma.session.update({
    where: {
      id: req.session.id,
    },
    data,
    include: {
      ip: true,
    },
  });

  let timeLeft = Verification.getExponencialTime(req.session);

  let minutes = new Date(timeLeft).getMinutes();
  let seconds = new Date(timeLeft).getSeconds();
  let hours = new Date(timeLeft).getHours();

  let pretty = `${minutes}m ${seconds}s`;

  if (hours >= 1) pretty = `${hours}h ${minutes}m ${seconds}s`;

  await Verification.sendTransacionalEmail(
    req.userData,
    verification,
    req.session,
  ).catch((err) => {
    throw new errors.InternalServerError(
      "Erro ao enviar o email de verificação.",
    );
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("sendedEmail", req.session.locale),
      info: {
        timeLeft,
        pretty,
      },
    },
  };

  next();
}

async function validateAuthenticationToken(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

  const token = new TokenType(req.body.token, req.session.locale).getValue();

  const authorizedTypes = [
    "AUTHENTICATION",
    "PRE_AUTHENTICATION",
    "VERIFY_SESSION",
  ];

  req.userData = (await Verification.verifyEmailToken(
    token,
    req.session,
    authorizedTypes,
    true,
    true,
  ).catch((err) => {
    throw err;
  })) as iUser;

  next();
}

async function validateRecoveryToken(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

  const token = new TokenType(req.body.token, req.session.locale).getValue();

  const authorizedTypes = ["RECOVERY"];

  req.userData = (await Verification.verifyEmailToken(
    token,
    req.session,
    authorizedTypes,
    true,
    true,
  ).catch((err) => {
    throw err;
  })) as iUser;

  next();
}

async function validateVerificationToken(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

  const token = new TokenType(req.body.token, req.session.locale).getValue();

  const authorizedTypes = ["VERIFICATION"];

  req.userData = (await Verification.verifyEmailToken(
    token,
    req.session,
    authorizedTypes,
  ).catch((err) => {
    throw err;
  })) as iUser;

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("emailVerified", req.session.locale),
    },
  };

  next();
}

async function setEmailVerified(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.userData) throw new errors.UserError("UserData Error");
  if (!req.session) throw new errors.UserError("Session Error");

  req.userData = await User.setEmailVerified(
    req.userData,
    req.session.locale,
  ).catch((err) => {
    throw err;
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("emailVerified", req.session.locale),
    },
  };

  next();
}

// async function recoveryPasswd(
//   req: iRequest,
//   res: Response,
//   next: NextFunction,
// ) {
//   if (!req.userData) throw new errors.UserError("UserData Error");
//   if (!req.session) throw new errors.UserError("Session Error");

//   req.userData = await User.changePassword(
//     req.userData,
//     req.data.newPasswd,
//   ).catch((err) => {
//     throw new errors.InternalServerError("Não foi possível alterar a senha.");
//   });

//   next();
// }

export default {
  validateAuthenticationToken,
  validateRecoveryToken,
  validateVerificationToken,
  validateEmail,
  validateResend,
  sendRecoveryEmail,
  sendVerifySessionEmail,
  sendAuthenticationEmail,
  sendVerificationEmail,
  setEmailVerified,
  validateIfEmailAlreadyVerified,
};
