import fs from "fs";

//obrigatory for controllers
import prisma from "./db.controller.js";

//optional
import crypt from "../crypt.js";

async function createNewUser(req, res, next) {
  //get params
  let { name, email, passwd, phone } = req.body;

  //encrypt passwd
  passwd = crypt.criptografar(passwd);

  let quiz = await fs.readFileSync("json_models/quiz.json", "utf-8");

  let data = {
    name,
    email,
    phone,
    passwd,
    quiz: {
      create: {
        slug: "quiz",
        quiz: JSON.parse(quiz),
        destiny:
          "https://wa.me/" +
          phone +
          "?text=" +
          encodeURI(
            "Olá, gostaria de saber mais sobre as sessões de terapia online."
          ),
      },
    },
  };

  if (req.body.support) data.support = req.body.support;

  //create register in database
  let created = await prisma.user.create({
    data,
  });

  //send id to next
  req.id = created.id;

  //send userdata * next functions depends this
  req.userData = created;

  next();
}

async function updateUser(req, res, next) {
  let data = req.body;

  let update = await prisma.user.update({
    where: {
      id: req.updateUserId,
    },
    data,
  });

  if (data.phone) {
    let q = await prisma.quiz.findMany({
      where: {
        userId: req.updateUserId,
      },
    });

    if (q)
      await prisma.quiz.updateMany({
        where: {
          user: {
            id: req.updateUserId,
          },
        },
        data: {
          destiny:
            "https://wa.me/" +
            data.phone +
            "?text=" +
            encodeURI(
              "Olá, gostaria de saber mais sobre as sessões de terapia online."
            ),
        },
      });
  }

  return res.status(201).send({
    status: "Ok",
    message: "Usuário atualizado com sucesso.",
    updatedParams: req.updatedParams,
  });
}

async function deleteUser(req, res, next) {
  //delete refresh tokens in db
  let deleteToken = await prisma.token.deleteMany({
    where: { userId: req.id },
  });

  //delete emil verification codes in db
  let deleteCodes = await prisma.verificationCode.deleteMany({
    where: { userId: req.id },
  });

  //delete emil verification codes in db
  let deleteLeads = await prisma.lead.deleteMany({
    where: { userId: req.id },
  });

  //delete transactions in db
  let deleteTransactions = await prisma.transactions.deleteMany({
    where: { userId: req.id },
  });

  let deleteSteps = await prisma.step.deleteMany({
    where: { userId: req.id },
  });

  let deleteQuiz = await prisma.quiz.deleteMany({
    where: { userId: req.id },
  });

  //delete user
  let deleteUser = await prisma.user.delete({ where: { id: req.id } });

  //response
  return res.status(201).send({
    status: "Ok",
    message: "Usuário " + deleteUser.email + " excluído.",
  });
}

async function getUserbyID(req, res, next) {
  //get user id
  let id = req.id;

  let f = {};
  let msg = "";

  if (req.userData.role == "ADMIN") {
    let query = {
      orderBy: {
        createdAt: "desc",
      },
    };

    if (req.body.take) query.take = req.body.take;

    if (typeof req.body.take != "number") query.take = 100;

    //db query
    let q = await prisma.user.findMany(query);

    f = q.map((user) => {
      user.passwd = "******************";

      return user;
    });

    msg = f.length + " usuários encontrados.";
  }

  if (req.userData.role == "SUPPORT") {
    let query = {
      orderBy: {
        createdAt: "desc",
      },
    };

    query.where = {
      OR: [{ support: req.userData.id }, { id: req.userData.id }],
    };

    if (req.body.take) query.take = req.body.take;

    if (typeof req.body.take != "number") query.take = 100;

    //db query
    let q = await prisma.user.findMany(query);

    f = q.map((user) => {
      user.passwd = "******************";

      return user;
    });

    msg = f.length + " usuários encontrados.";
  }

  if ((req.userData.role == "USER") | req.body.my) {
    //db query
    f = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    msg = "Usuário " + req.id + " encontrado.";
  }

  //response
  return res.status(200).send({
    status: "Ok",
    message: msg,
    data: f,
  });
}

export default {
  getUserbyID,
  createNewUser,
  updateUser,
  deleteUser,
};
