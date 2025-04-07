// //obrigatory for middlewares
// import prisma from "../controllers/db.controller.js";
// import errors from "../errors/errors.js";

// import crypt from "../core/crypt.js";
// import { isValidObjectId } from "mongoose";
// import response from "../response/response.js";

// async function validateStringParams(req, res, next) {
//   Object.values(req.body).filter((param) => {
//     if (typeof param != "string")
//       throw new errors.UserError(response.invalidParam(param));
//     if (param.length > 256)
//       throw new errors.UserError(response.invalidParam(param));
//   });

//   next();
// }

// async function getQuiz(req, res, next) {
//   //buscar qual o quiz a partir da slug informada na url
//   if (!isValidObjectId(req.params.id))
//     throw new errors.UserError(response.invalidParam("User ID"));

//   let q = await prisma.quiz.findFirst({
//     where: {
//       AND: [
//         {
//           slug: req.params.slug,
//         },
//         {
//           userId: req.params.id,
//         },
//       ],
//     },
//   });

//   //verifica se quiz existe
//   if (!q) throw new errors.UserError(response.quizNotFound());

//   req.quiz = q;

//   next();
// }

// async function validateLeadRegister(req, res, next) {
//   //definir modelo do leadData
//   req.leadData = {};

//   if (Object.keys(req.body).length < 1)
//     throw new errors.UserError(response.requiresOne());

//   //converter objeto em array com os parametros
//   let params = Object.keys(req.body);

//   //validar parametros do lead de acordo com o quiz
//   params.map((p) => {
//     // se parametro existe no quiz
//     if (req.quiz.steps.steps[p]) {
//       //se o tipo do parametro está de acordo com o definido quiz
//       if (req.quiz.steps.steps[p].type != typeof req.body[p])
//         throw new errors.UserError(response.invalidType());

//       if (req.quiz.steps.steps[p].options) {
//         if (!(req.body[p] in req.quiz.steps.steps[p].options)) {
//           throw new errors.UserError(response.invalidOption(p));
//         }
//       }

//       //salva os parametros dentro do leadData
//       req.leadData[p] = req.body[p];
//     }
//   });

//   //se nenhum parametro é valido
//   if (Object.keys(req.leadData).length == 0)
//     throw new errors.UserError(response.requiresOne());

//   next();
// }

// async function validateLeadUpdate(req, res, next) {
//   req.dbQuery.data = { quizData: {} };

//   if (Object.keys(req.body).length < 1)
//     throw new errors.UserError(response.requiresOne());

//   //converter objeto em array com os parametros
//   let params = Object.keys(req.body);

//   //validar parametros do lead de acordo com o quiz
//   params.map((p) => {
//     // se parametro existe no quiz
//     if (req.quiz.steps.steps[p]) {
//       //se o tipo do parametro está de acordo com o definido quiz
//       if (req.quiz.steps.steps[p].type != typeof req.body[p])
//         throw new errors.UserError(response.invalidType());

//       if (req.quiz.steps.steps[p].options) {
//         if (!(req.body[p] in req.quiz.steps.steps[p].options)) {
//           console.log(req.quiz.steps.steps[p]);
//           throw new errors.UserError(response.invalidOption(p));
//         }
//       }

//       if (p == "phone") req.emailNotification = "CONTATO CADASTRADO";
//       //salva os parametros dentro do leadData
//       req.dbQuery.data.quizData[p] = req.body[p];
//     }
//   });

//   if (Object.keys(req.dbQuery.data).length < 1)
//     throw new errors.UserError(response.requiresOne());

//   next();
// }

// async function validateLeadId(req, res, next) {
//   if (req.params.leadId) {
//     if (!isValidObjectId(req.params.leadId))
//       throw new errors.UserError(response.invalidParam("Lead ID"));

//     let q = await prisma.lead.findUnique({
//       where: {
//         id: req.params.leadId,
//       },
//     });

//     if (!q) throw new errors.UserError(response.leadNotFound());

//     req.dbQuery = {
//       where: {
//         id: req.params.leadId,
//       },
//     };
//   }

//   next();
// }

// async function validateQuery(req, res, next) {
//   req.dbQuery = {
//     where: {},
//   };
//   if (req.params.id) {
//     if (!isValidObjectId(req.params.id))
//       throw new errors.UserError(response.invalidParam("User ID"));
//     let user = await prisma.user.findUnique({ where: { id: req.params.id } });

//     if (!user) throw new errors.UserError(response.userNotFound());

//     req.leadOwner = user;

//     req.dbQuery.where.userId = req.params.id;

//     if (req.params.slug) {
//       let quiz = await prisma.quiz.findFirst({
//         where: { userId: req.params.id, slug: req.params.slug },
//       });

//       if (!quiz) throw new errors.UserError(response.quizNotFound());

//       req.dbQuery.where.quizId = quiz.id;
//       if (req.params.leadId) {
//         if (!isValidObjectId(req.params.leadId))
//           throw new errors.UserError(response.invalidParam("Lead ID"));

//         let lead = await prisma.lead.findUnique({
//           where: { id: req.params.leadId },
//         });

//         if (!lead) throw new errors.UserError(response.leadNotFound());

//         req.dbQuery.where.id = req.params.leadId;
//       }
//     }
//   }
//   next();
// }

// async function validateSortBy(req, res, next) {
//   let aproved = { updatedAt: true, createdAt: true };
//   let aprovedSort = { asc: true, desc: true };
//   let sort = "desc";

//   if (req.query.sort in aprovedSort) sort = req.query.sort;

//   req.dbQuery.orderBy = {
//     updatedAt: sort,
//   };

//   if (req.query.orderBy in aproved) {
//     req.dbQuery.orderBy = {};
//     req.dbQuery.orderBy[req.query.orderBy] = sort;
//   }

//   if (req.query.take >= 0)
//     req.dbQuery.take = new Number(req.query.take).valueOf();

//   if (req.query.skip >= 0)
//     req.dbQuery.skip = new Number(req.query.skip).valueOf();

//   next();
// }

// async function verifyDelete(req, res, next) {
//   let required = [];

//   if (!req.params.id) required.push("User ID");
//   if (!req.params.slug) required.push("Quiz slug");
//   if (!req.params.leadId) required.push("Lead ID");

//   if (!(req.userData.email in req.leadOwner.support))
//     throw new errors.AuthError(response.unauthorizated());

//   next();
// }

// export default {
//   validateLeadRegister,
//   validateSortBy,
//   validateLeadId,
//   validateStringParams,
//   validateLeadUpdate,
//   getQuiz,
//   validateQuery,
//   verifyDelete,
// };
