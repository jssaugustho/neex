import Neex from "@neex/core";

import startAction from "./src/actions/startAction.js";

const { Prisma, Logger, TelegramBot, Seller, Product } = Neex();

const accesToken: string | null = null;
const refreshToken: string | null = null;

async function onboard() {
  return new Promise(async (resolve, reject) => {
    await startAction();
  });
}

onboard().catch((e) => {
  console.log("Error: ", e);
});
