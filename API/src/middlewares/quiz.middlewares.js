//obrigatory for middlewares
import errors from "../errors/errors.js";
import response from "../response/response.js";
import quiz from "../core/Quiz/Quiz.js";
async function validateStringParams(req, res, next) {
    Object.values(req.body).filter((param) => {
        if (typeof param != "string")
            throw new errors.UserError(response.invalidParam(param));
        if (param.length > 256)
            throw new errors.UserError(response.invalidParam(param));
    });
    next();
}
async function validateCreateQuizParams(req, res, next) {
    if (req.body.slug) {
        const verify = await quiz.verifySlug(req.body.slug);
        if (verify)
            throw new errors.UserError(response.quizExists());
        if (req.body.slug.length > 32 && req.body.slug < 4)
            throw new errors.UserError(response.invalidParam("slug"));
    }
    else {
        throw new errors.UserError(response.obrigatoryParam("slug"));
    }
    if (req.body.name) {
        if (req.body.name.length > 32 && req.body.name < 4)
            throw new errors.UserError(response.invalidParam("name"));
    }
    else {
        throw new errors.UserError(response.obrigatoryParam("name"));
    }
    next();
}
async function validateVerifySlug(req, res, next) {
    if (req.body.slug) {
        if (req.body.slug.length > 32 && req.body.slug < 4)
            throw new errors.UserError(response.invalidParam("slug"));
        next();
    }
    else {
        throw new errors.UserError(response.obrigatoryParam("slug"));
    }
}
export default {
    validateStringParams,
    validateCreateQuizParams,
    validateVerifySlug,
};
//# sourceMappingURL=quiz.middlewares.js.map