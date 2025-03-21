import prisma from "../../controllers/db.controller.js";
async function createQuiz(data) {
    return await prisma.quiz.create({
        data: {
            ...data,
            public: false,
        },
    });
}
async function verifySlug(slug) {
    const quiz = await prisma.quiz.findUnique({
        where: {
            slug,
        },
    });
    if (quiz)
        return true;
    return false;
}
export default {
    verifySlug,
    createQuiz,
};
//# sourceMappingURL=Quiz.js.map