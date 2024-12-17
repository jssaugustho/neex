//optional
import nodemailer from "nodemailer";
import errors from "../errors.js";

const transporter = await nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWD,
  },
});

async function sendVerificationCode(req, res, next) {
  //configure message
  let message = {
    from: "Lux CRM © <joseaugustho@luxdigitalassessoria.com.br>",
    to: req.userData.email,
    subject: "Lux CRM © - Código de verificação de e-mail",
    text: "Código de verificação do email: " + req.emailVerificationCode,
  };

  //send email
  let email = transporter.sendMail(message, (err, info) => {
    if (err) throw new errors.InternalServerError(err);
    next();
  });
}

async function sendEmailVerifiedNotification(req, res, next) {
  let message = {
    from: "Lux CRM © <joseaugustho@luxdigitalassessoria.com.br>",
    to: req.userData.email,
    subject: "Lux CRM © - Email verificado.",
    text: "Email verificado com sucesso.",
  };

  let email = transporter.sendMail(message, (err, info) => {
    if (err) throw new errors.InternalServerError("Problema ao enviar e-mail.");
    //value
    res.status(201).send({
      status: "Ok",
      message: "Email verificado.",
    });
  });
}

async function sendPasswdRecoveryCode(req, res, next) {
  //configure message
  let message = {
    from: "Lux CRM © <joseaugustho@luxdigitalassessoria.com.br>",
    to: req.userData.email,
    subject: "Lux CRM © - Código de recuperação de senha.",
    text: "Código: " + req.emailVerificationCode,
  };

  //send email
  let email = transporter.sendMail(message, (err, info) => {
    if (err) throw new errors.InternalServerError(err);
    next();
  });
}

async function sendPasswdRecoveryConfirmation(req, res, next) {
  let message = {
    from: "Lux CRM © <joseaugustho@luxdigitalassessoria.com.br>",
    to: req.userData.email,
    subject: "Lux CRM © - Senha recuperada com sucesso.",
    text: "Senha recuperada pelo email.",
  };

  let email = transporter.sendMail(message, (err, info) => {
    if (err) throw new errors.InternalServerError("Problema ao enviar e-mail.");
    next();
  });
}

async function sendLeadNotification(req, res, next) {
  let html = Object.keys(req.leadData.quizData).map((param) => {
    return req.quiz.quiz[param].email + ": " + req.leadData.quizData[param];
  });

  html.push("Entre no CRM para ver mais.");

  if (req.leadNotification) {
    let message = {
      from: "Lux CRM © <joseaugustho@luxdigitalassessoria.com.br>",
      to: req.userData.email,
      subject: "[NEW LEAD] " + req.leadData.quizData.name,
      html: html.join("<br/>"),
    };

    //send email
    let email = transporter.sendMail(message, (err, info) => {
      if (err) throw new errors.InternalServerError(err);
    });
  }

  next();
}

export default {
  sendVerificationCode,
  sendEmailVerifiedNotification,
  sendPasswdRecoveryCode,
  sendPasswdRecoveryConfirmation,
  sendLeadNotification,
};
