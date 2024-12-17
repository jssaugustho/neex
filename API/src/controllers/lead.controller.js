//obrigatory for controllers
import prisma from "./db.controller.js";

async function registerLead(req, res, next) {
  //buscar leadData
  let data = req.leadData;

  //relacionar lead com o usuário
  let userConnect = {
    connect: {
      id: req.ownerId,
    },
  };

  data.user = userConnect;

  //relacionar lead com o quiz
  let quizConnect = {
    connect: {
      id: req.quiz.id,
    },
  };

  data.quiz = quizConnect;

  //criar ou atualizar lead
  if (req.update) {
    //setar o id
    let id = req.existentData.id;

    //deletar o id dos dados do lead
    delete data.id;

    //query para atualizar
    await prisma.lead.update({
      where: { id },
      data,
    });

    //retornar msg
    req.msg = {
      status: "Ok",
      message: "Lead atualizado.",
      params: data.quizData,
    };
  } else {
    //query para criar
    let created = await prisma.lead.create({
      data,
    });

    //enviar notificação de novo lead
    req.leadNotification = true;

    //retornar mensagem com o id criado
    req.msg = {
      status: "Ok",
      message: "Lead cadastrado.",
      leadId: created.id,
    };
  }

  next();
}

async function getLeadsAndFilter(req, res, next) {
  let q = await prisma.lead.findMany(req.dbQuery);

  return res.status(200).send({
    status: "Ok",
    msg: Object.keys(q).length + " leads encontrados",
    data: q,
  });
}

async function responseLeadCreated(req, res, next) {
  return res.status(201).send(req.msg);
}

export default {
  registerLead,
  getLeadsAndFilter,
  responseLeadCreated,
};
