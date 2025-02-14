//optional
import nodemailer from "nodemailer";
import errors from "../errors/errors.js";

import prisma from "./db.controller.js";

const transporter = await nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: new Number(process.env.SMTP_PORT),
  secure: new Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWD,
  },
});

async function sendVerificationCode(req, res, next) {
  //configure message
  let message = {
    from: `Lux CRM © <${process.env.EMAIL_USER}>`,
    to: req.userData.email,
    subject: "Lux CRM © - Código de verificação de e-mail",
    html:
      "<p>Código de verificação do email: <b>" +
      req.emailVerificationCode +
      "</b><br/><br/>Não compartilhe esse código com ninguém.</p>",
  };

  //send email
  let email = transporter.sendMail(message, (err, info) => {
    if (err) throw new errors.InternalServerError(err);
    next();
  });
}

async function sendEmailVerifiedNotification(req, res, next) {
  let message = {
    from: `Lux CRM © <${process.env.EMAIL_USER}>`,
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
    from: `Lux CRM © <${process.env.EMAIL_USER}>`,
    to: req.userData.email,
    subject: "Lux CRM © - Código de recuperação de senha.",
    text: "Código: " + req.emailVerificationCode,
  };

  //send email
  let email = await transporter.sendMail(message, (err, info) => {
    if (err) throw new errors.InternalServerError(err);
    next();
  });

  console.log(email);
}

async function sendPasswdRecoveryConfirmation(req, res, next) {
  let message = {
    from: `Lux CRM © <${process.env.EMAIL_USER}>`,
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
  if (req.emailNotification) {
    let userData = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    //user data em html
    let html = Object.keys(req.leadData).map((param) => {
      return req.quiz.steps.steps[param].title + ": " + req.leadData[param];
    });

    html.push("Entre no CRM para ver mais.");

    let userMessage = {
      from: `Lux CRM © <${process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: "[LEAD] [" + req.emailNotification + "] " + req.leadData.name,
      html: html.join("<br/>"),
    };

    Object.keys(userData.support).map(async (email) => {
      let q = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (q.emailNotification) {
        let supportMessage = {
          from: `Lux CRM © <${process.env.EMAIL_USER}>`,
          to: email,
          subject:
            "[LEAD] [" +
            req.emailNotification +
            "] [" +
            userData.email +
            "] " +
            req.leadData.name,
          html: html.join("<br/>"),
        };

        //send email to support
        transporter.sendMail(supportMessage, (err, info) => {
          if (err) throw new errors.InternalServerError(err);
        });
      }
    });

    //send email to user
    if (userData.emailNotification)
      transporter.sendMail(userMessage, (err, info) => {
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
