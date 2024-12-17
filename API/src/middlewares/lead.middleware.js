//obrigatory for middlewares
import prisma from "../controllers/db.controller.js";
import errors from "../errors.js";
import { isValidObjectId } from "mongoose";

async function getLeadOwner(req, res, next) {
  req.ownerId = req.id;

  if (req.body.id) {
    if (!isValidObjectId(req.body.id))
      throw new errors.UserError("Id inválido");

    req.existentData = await prisma.lead.findUnique({
      where: {
        id: req.body.id,
      },
    });

    if (req.existentData) {
      req.ownerId = req.existentData.userId;
    } else {
      throw new errors.UserError("Lead não encontrado.");
    }

    req.update = true;
  }

  next();
}

async function getQuiz(req, res, next) {
  //buscar qual o quiz a partir da slug informada na url
  let q = await prisma.quiz.findFirst({
    where: {
      AND: [
        {
          slug: req.params.slug,
        },
        {
          userId: req.ownerId,
        },
      ],
    },
  });

  //verifica se quiz existe
  if (!q) throw new errors.UserError("Quiz não encontrado.");

  req.quiz = q;

  next();
}

async function validateLeadRegister(req, res, next) {
  //definir modelo do leadData
  req.leadData = {
    quizData: {},
  };

  let aproved = false;

  //verificar se lead pertence ao user que chamou
  if (req.id == req.ownerId) aproved = true;

  req.leadOwner = await prisma.user.findUnique({
    where: { id: req.ownerId },
  });

  //verifica se user que chamou tem permissão de suporte
  if (req.leadOwner.support == req.id && req.userData.role == "SUPPORT")
    aproved = true;

  if (req.userData.role == "ADMIN") aproved = true;

  if (!aproved) throw new errors.AuthError("Não autorizado.");

  if (!req.body.quizData)
    throw new errors.UserError("Campo obrigatório: quizData");

  //converter objeto em array com os parametros
  let params = Object.keys(req.body.quizData);

  //validar parametros do lead de acordo com o quiz
  req.validParams = params.map((p) => {
    // se parametro existe no quiz
    if (req.quiz.quiz[p]) {
      //se o tipo do parametro está de acordo com o definido quiz
      if (req.quiz.quiz[p].type != typeof req.body.quizData[p])
        throw new errors.UserError("Tipo do campo inválido: " + p);

      if (req.quiz.quiz[p].options) {
        if (!(req.body.quizData[p] in req.quiz.quiz[p].options)) {
          console.log(req.quiz.quiz[p]);
          throw new errors.UserError("Resposta do campo inválida: " + p);
        }
      }

      //salva os parametros dentro do leadData
      req.leadData.quizData[p] = req.body.quizData[p];
    }
  });

  //se nenhum parametro é valido
  if (Object.keys(req.leadData.quizData).length == 0)
    throw new errors.UserError("Requer pelo menos um campo.");

  next();
}

async function validateLeadFilter(req, res, next) {
  let { maxQuantity } = req.body;

  let query = {
    orderBy: { updatedAt: "desc" },
  };

  if (!maxQuantity) maxQuantity = 50;

  if (typeof maxQuantity != "number")
    throw new errors.UserError("Campo maxQuantity deve ser um número.");

  if ((req.userData.role == "ADMIN") & !req.body.my) delete query.where;

  if ((req.userData.role == "SUPPORT") & !req.body.my) {
    query.where = {
      support: req.userId,
    };
  }

  if ((req.userData.role == "USER") | req.body.my)
    query.where = { userId: req.id };

  query.take = maxQuantity;

  req.dbQuery = query;

  next();
}

export default {
  getLeadOwner,
  getQuiz,
  validateLeadRegister,
  validateLeadFilter,
};
