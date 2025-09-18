import inquirer from "inquirer";

import Neex from "@neex/core";
import onboardingAction from "./onboardingAction.js";
import createAccount from "./createAccount.js";
import createUser from "./createUser.js";
import createSeller from "./createSeller.js";
import createBot from "./createBot.js";
import createProducts from "./createProducts.js";

const AsciiArt = `
  _   _ ______ ________   __   _____ _     _    _ ____  
 | \\ | |  ____|  ____\\ \\ / /  / ____| |   | |  | |  _ \\ 
 |  \\| | |__  | |__   \\ V /  | |    | |   | |  | | |_) |
 | . \` |  __| |  __|   > <   | |    | |   | |  | |  _ < 
 | |\\  | |____| |____ / . \\  | |____| |___| |__| | |_) |
 |_| \\_|______|______/_/ \\_\\  \\_____|______\\____/|____/ 
      

 Archive: ../../services/bot/.env

    `;

export default async function startAction(): Promise<void> {
  let running = true;

  console.log(AsciiArt);

  while (running) {
    const res = await inquirer.prompt<{ action: string }>({
      type: "list",
      name: "action",
      message: "Select an action:",
      choices: [
        {
          value: "onboarding",
          name: "1 - Onboarding",
        },
        {
          value: "create-user",
          name: "2 - Create user",
        },
        {
          value: "create-account",
          name: "3 - Create account",
        },
        {
          value: "create-seller",
          name: "4 - Create seller",
        },
        {
          value: "create-bot",
          name: "5 - Create bot",
        },
        {
          value: "create-products",
          name: "6 - Create products",
        },
        {
          value: "exit",
          name: "7 - Exit",
        },
      ],
    });
    switch (res.action) {
      case "onboarding":
        await onboardingAction();
        break;

      case "create-account":
        await createAccount();
        break;

      case "create-user":
        await createUser();
        break;

      case "create-seller":
        await createSeller();
        break;

      case "create-bot":
        await createBot();
        break;

      case "create-products":
        await createProducts();
        break;

      case "exit":
        running = false;
        break;
    }
  }
}
