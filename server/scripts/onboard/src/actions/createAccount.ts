import Neex from "@neex/core";
import inquirer from "inquirer";

import { User as iUser } from "@prisma/client";
import writeInEnv from "../lib/environment";

const { Account } = Neex();

async function createAccount(user?: iUser) {
  console.log("\n");

  const { name, description, userId } = await inquirer.prompt<{
    name: string;
    description: string;
    userId: string;
  }>([
    {
      type: "input",
      name: "name",
      message: "Account name:",
    },
    {
      type: "input",
      name: "description",
      message: "Account Description:",
    },
    {
      type: "input",
      name: "userId",
      message: "User ID (Last user created by default):",
      default: user?.id || "",
    },
  ]);

  console.log("\nCreating account...");

  const account = await Account.createAccount(name, description, userId);

  writeInEnv({
    ACCOUNT_ID: account.id,
  });

  console.log("Account created.");

  return account;
}

export default createAccount;
