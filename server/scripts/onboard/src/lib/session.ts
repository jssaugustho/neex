import { Neex } from "@neex/core";
import iSessionPayload from "packages/core/dist/@types/iSessionPayload/iSessionPayload.js";

const { Prisma } = Neex();

async function initSession() {
  return (await Prisma.session.create({
    data: {
      fingerprint: "onboarding",
      locale: "pt-BR",
      name: "Script de onboarding.",
      timeZone: "America/Sao_Paulo",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
      ip: {
        connectOrCreate: {
          create: {
            address: "127.0.0.1",
            city: "São Paulo",
            country: "Brazil",
            region: "SP",
            timeZone: "America/Sao_Paulo",
          },
          where: {
            address: "127.0.0.1",
          },
        },
      },
    },
  })) as iSessionPayload;
}

export default await initSession();
