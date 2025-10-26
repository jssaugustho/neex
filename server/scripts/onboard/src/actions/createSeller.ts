import inquirer from "inquirer";
import { Neex } from "packages/core/dist/index.js";

const { Seller } = Neex();

async function createSeller(userIdLoaded?: string, accountIdLoaded?: string) {
  console.log("\n");

  const { userId, accountId } = await inquirer.prompt<{
    userId: string;
    accountId: string;
  }>([
    {
      type: "input",
      name: "userId",
      message: "User ID (Last user created by default):",
      default: userIdLoaded,
      required: true,
    },
    {
      type: "input",
      name: "accountId",
      message: "Account ID (Last user created by default):",
      default: accountIdLoaded,
      required: true,
    },
  ]);

  console.log("\nRegistering new seller...");

  const seller = await Seller.createNewSeller(userId, accountId, false);

  console.log("Seller registered.");

  return seller;
}

export default createSeller;
