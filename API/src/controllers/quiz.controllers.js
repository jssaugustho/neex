import errors from "../errors/errors.js";
import response from "../response/response.js";
import quiz from "../core/Quiz/Quiz.js";
async function createNewQuiz(req, res) {
    const createdQuiz = await quiz.createQuiz({
        name: req.body.name,
        slug: req.body.slug,
        userId: req.userData.id,
    });
    return res.status(200).send({
        status: "Ok",
        message: "Quiz criado com sucesso.",
        data: createdQuiz,
    });
}
async function verifySlugExists(req, res) {
    const verify = await quiz.verifySlug(req.body.slug);
    if (verify)
        throw new errors.UserError(response.quizExists());
    return res.status(200).send({
        status: "Ok",
        message: "Disponível.",
    });
}
export default {
    createNewQuiz,
    verifySlugExists,
};
//# sourceMappingURL=quiz.controllers.js.map