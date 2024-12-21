import fs from "fs";

//obrigatory for controllers
import prisma from "./db.controller.js";

//optional
import crypt from "../core/crypt.js";
import response from "../response/response.js";

async function registerNewUser(req, res, next) {
  let created = await prisma.user.create({
    data: req.registerData,
  });

  //salvar na variavel userdata
  req.userData = created;

  next();
}

async function updateUser(req, res, next) {
  let update = await prisma.user.update({
    where: req.where,
    data: req.updateData,
  });

  if (req.updateData.passwd) req.updateData.passwd = "********";

  return res.status(201).send({
    status: "Ok",
    message: response.succesUserUpdate(),
    updatedParams: req.updateData,
  });
}

async function deleteUserbyQuery(req, res, next) {
  //delete refresh tokens in db
  let deleteToken = await prisma.token.deleteMany({
    where: { userId: req.deleteId },
  });

  //delete emil verification codes in db
  let deleteCodes = await prisma.verificationCode.deleteMany({
    where: { userId: req.deleteId },
  });

  //delete emil verification codes in db
  let deleteLeads = await prisma.lead.deleteMany({
    where: { userId: req.deleteId },
  });

  //delete transactions in db
  let deleteTransactions = await prisma.transactions.deleteMany({
    where: { userId: req.deleteId },
  });

  let deleteSteps = await prisma.step.deleteMany({
    where: { userId: req.deleteId },
  });

  let deleteQuiz = await prisma.quiz.deleteMany({
    where: { userId: req.deleteId },
  });

  //delete user
  let deleteUser = await prisma.user.delete({ where: { id: req.deleteId } });

  //response
  return res.status(201).send({
    status: "Ok",
    message: "Usuário " + deleteUser.email + " excluído.",
  });
}

async function getUserbyQuery(req, res, next) {
  let f = await prisma.user.findMany(req.dbQuery);

  let p = f.map((r) => {
    r.passwd = "********";
    return r;
  });

  let filtered = p;

  if (req.userData.role != "ADMIN" && req.path != "/user")
    filtered = f.filter((p) => {
      return req.userData.email in p.support;
    });

  if (req.userData.role == "ADMIN")
    filtered = f.filter((p) => {
      return req.userData.email in p.support || req.userData.id != p.id;
    });

  //response
  return res.status(200).send({
    status: "Ok",
    message: response.userFound(Object.keys(filtered).length),
    query: req.dbQuery,
    data: filtered,
  });
}

export default {
  getUserbyQuery,
  registerNewUser,
  updateUser,
  deleteUserbyQuery,
};
