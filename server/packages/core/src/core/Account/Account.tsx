import Prisma from "../Prisma/Prisma.js";

import { Prisma as iPrisma } from "@prisma/client";

export type iAccountPayload = iPrisma.AccountGetPayload<{
  include: {
    products: true;
    seller: true;
    user: true;
  };
}>;

class Account {
  async createAccount(
    name: string,
    description: string,
    userId: string,
  ): Promise<iAccountPayload> {
    return await Prisma.account.create({
      data: {
        name,
        description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        products: true,
        seller: true,
        user: true,
      },
    });
  }

  async getAccount(accountId: string) {
    return await Prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        user: true,
        seller: true,
        products: true,
      },
    });
  }
}

export default new Account();
