import {
  Product as iProduct,
  Account as iAccount,
  Seller as iSeller,
} from "@prisma/client";
import Prisma from "../Prisma/Prisma.js";

import { Prisma as iPrisma } from "@prisma/client";
import { currencies } from "../../lib/currencies.js";

export type iProductPayload = iPrisma.ProductGetPayload<{
  include: {
    prices: true;
  };
}>;

type iProductConfig = {
  order: number;
  slug: string;
  description: string;
  prices: Record<
    string,
    {
      amount: number;
      locale: string;
    }
  >; // ex: { brl: 1900, eur: 900, usd: 900 }
};

class Product {
  async createProducts(
    products: iProductConfig[],
    account: iAccount,
  ): Promise<iProduct[]> {
    const newProducts = products.map(async (product) => {
      // 1️⃣ Cria o produto
      const newProduct = await Prisma.product.create({
        data: {
          order: product.order,
          slug: product.slug,
          description: product.description,
          active: true,
          account: {
            connect: { id: account.id },
          },
        },
      });

      const pricesData = Object.entries(product.prices).map(
        ([currency, { amount, locale }]) => ({
          currency,
          amount,
          locale,
          productId: newProduct.id,
        }),
      );

      await Prisma.price.createMany({ data: pricesData });

      return newProduct;
    });

    return await Promise.all(newProducts);
  }

  listProducts(account: iAccount): Promise<iProductPayload[]> {
    return new Promise(async (resolve, reject) => {
      const products = await Prisma.product.findMany({
        where: {
          account: {
            id: account.id,
          },
        },
        orderBy: {
          order: "asc",
        },
        include: {
          prices: true,
        },
      });

      resolve(products as iProductPayload[]);
    });
  }

  async getPriceByCurrency(
    product: iProductPayload,
    currency: string,
  ): Promise<number> {
    const price = product.prices.find((price) => {
      if (price.currency === currency) {
        return price;
      }
    });

    if (!price) {
      throw new Error("Price not found");
    }

    return price.amount;
  }
}

export default new Product();
