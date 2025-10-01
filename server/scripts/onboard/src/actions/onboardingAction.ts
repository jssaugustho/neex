import Neex from "@neex/core";

import createAccount from "./createAccount.js";
import createUser from "./createUser.js";
import createSeller from "./createSeller.js";
import createBot from "./createBot.js";
import createProducts from "./createProducts.js";
import createMGMTBot from "./createNotificationsBot.js";

const { Prisma } = Neex();

export default async function onboardingAction(): Promise<void> {
  console.log("Initializing onboarding...");

  const user = await createUser();

  const account = await createAccount(user);

  const seller = await createSeller(user.id, account.id);

  const mgmtBot = await createMGMTBot();

  const bot = await createBot(account.id, mgmtBot.token);

  const products = await createProducts(account);
}
