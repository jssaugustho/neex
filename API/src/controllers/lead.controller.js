//obrigatory for controllers
import { get } from "http";
import response from "../response/response.js";
import prisma from "./db.controller.js";

async function registerLead(req, res, next) {
  req.registerData = {
    user: {
      connect: {
        id: req.params.id,
      },
    },
    quiz: {
      connect: {
        id: req.quiz.id,
      },
    },
    quizData: req.leadData,
  };

  //query para criar
  let created = await prisma.lead.create({
    data: req.registerData,
  });

  //enviar notificação de novo lead
  req.emailNotification = "INICIOU CADASTRO";

  //retornar mensagem com o id criado
  req.msg = {
    status: "Ok",
    message: "Lead cadastrado.",
    leadId: created.id,
  };

  next();
}

async function getLeadsbyQuery(req, res, next) {
  let f = await prisma.lead.findMany(req.dbQuery);

  let filtered = [];

  if (req.userData.role == "ADMIN") {
    filtered = f.filter((p) => {
      return p.userId != req.userData.id;
    });
    //response
    req.msg = {
      status: "Ok",
      message: response.leadFound(Object.keys(filtered).length),
      query: req.dbQuery,
      data: filtered,
    };
    next();
  }

  filtered = f.filter((p) => {
    return req.userData.email in p.support;
  });

  req.msg = {
    status: "Ok",
    message: response.leadFound(Object.keys(filtered).length),
    query: req.dbQuery,
    data: filtered,
  };
  next();
}

async function getAllLeads(req, res, next) {
  let f = await prisma.lead.findMany({ where: {} });

  let filtered = [];

  if (req.userData.role == "ADMIN") {
    filtered = f.filter((p) => {
      return p.userId != req.userData.id;
    });
    //response
    req.msg = {
      status: "Ok",
      message: response.leadFound(Object.keys(filtered).length),
      query: req.dbQuery,
      data: filtered,
    };
    next();
  }

  filtered = f.filter((p) => {
    return req.userData.email in p.support;
  });

  req.msg = {
    status: "Ok",
    message: response.leadFound(Object.keys(filtered).length),
    query: req.dbQuery,
    data: filtered,
  };

  next();
}

async function responseGetLeads(req, res, next) {
  return res.status(200).send(req.msg);
}

async function updateLead(req, res, next) {
  let q = await prisma.lead.update(req.dbQuery);

  req.msg = {
    status: "Ok",
    msg: response.succesLeadUpdate(),
    data: q,
  };

  req.leadData = q.quizData;

  next();
}

async function responseLead(req, res, next) {
  return res.status(201).send(req.msg);
}

async function deleteLead(req, res) {
  let q = await prisma.lead.delete(req.dbQuery);

  return res.status(200).send({
    status: "Ok",
    msg: response.succesLeadDelete(),
    deleted: q,
  });
}

export default {
  registerLead,
  getLeadsbyQuery,
  responseLead,
  responseGetLeads,
  updateLead,
  deleteLead,
  getAllLeads,
};
