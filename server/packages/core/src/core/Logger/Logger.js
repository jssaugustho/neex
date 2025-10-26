const isDev = process.env.NODE_ENV !== "production";
import { pino } from "pino";
const Logger = pino(isDev
    ? {
        formatters: {
            log: (object) => {
                let publicObj = object;
                if (object.body?.passwd) {
                    publicObj = {
                        ...object,
                        body: {
                            ...object.body,
                            passwd: "******************",
                        },
                    };
                }
                if (object.token) {
                    publicObj = {
                        ...object,
                        token: "Bearer ************************************************************************************************************",
                    };
                }
                if (object.refreshToken) {
                    publicObj = {
                        ...object,
                        refreshToken: "Bearer ************************************************************************************************************",
                    };
                }
                if (object.body?.token) {
                    publicObj = {
                        ...object,
                        body: {
                            ...object.body,
                            token: "************************************************************************************************************",
                        },
                    };
                }
                return publicObj;
            },
        },
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
            },
        },
    }
    : {
        level: process.env.LOG_LEVEL || "info",
    });
export default Logger;
