import Neex from "@neex/core";
import inquirer from "inquirer";

import products from "../config/products.json" with { type: "json" };

import { Account as iAccount, Product as iProduct } from "@prisma/client";

const { Product, Prisma } = Neex();

async function createProducts(account?: iAccount): Promise<iProduct[] | null> {
  console.log("\n");

  let atualAccount: iAccount | null = account || null;

  const { accountId } = await inquirer.prompt<{
    accountId: string;
  }>([
    {
      type: "input",
      name: "accountId",
      message: "Account ID:",
      default: account?.id || "",
    },
  ]);

  if (!atualAccount) {
    atualAccount = await Prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });
  }

  console.log("\nCreating products...");

  const newProducts = await Product.createProducts(
    products,
    atualAccount as iAccount,
  );

  console.log("Products created successfully.");

  return await Promise.all(newProducts);
}

export default createProducts;
