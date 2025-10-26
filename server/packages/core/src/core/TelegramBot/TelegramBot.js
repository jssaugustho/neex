import Prisma from "../Prisma/Prisma.js";
class TelegramBot {
    async createBot(botToken, mgmtBotToken, groupId, accountId, notificationsGroupId) {
        return new Promise(async (resolve, reject) => {
            let telegramBot = await Prisma.telegramBot.create({
                data: {
                    active: false,
                    token: botToken,
                    groupId,
                    notificationsGroupId,
                    account: {
                        connect: {
                            id: accountId,
                        },
                    },
                    managementBot: {
                        connect: {
                            token: mgmtBotToken,
                        },
                    },
                },
                include: {
                    account: true,
                    managementBot: true,
                },
            });
            resolve(telegramBot);
        });
    }
    async startBot(telegramBotId) {
        return new Promise(async (resolve, reject) => {
            let telegramBot = await Prisma.telegramBot.update({
                where: {
                    id: telegramBotId,
                },
                data: {
                    active: true,
                },
                include: {
                    account: true,
                    managementBot: true,
                },
            });
            resolve(telegramBot);
        });
    }
    async stopBot(botToken) {
        return new Promise(async (resolve, reject) => {
            let bot = Prisma.telegramBot.update({
                where: {
                    token: botToken,
                },
                data: {
                    active: false,
                },
                include: {
                    account: true,
                    managementBot: true,
                },
            });
            resolve(bot);
        });
    }
}
export default new TelegramBot();
