import Email from "../Email/Email.js";
import ActivateStripe from "../Email/models/ActivateStripe.js";
import Prisma from "../Prisma/Prisma.js";
import StripePayments from "../StripePayments/StripePayments.js";
import React from "react";

import {
  User as iUser,
  Seller as iSeller,
  Prisma as iPrisma,
} from "@prisma/client";

export type iSellerPayload = iPrisma.SellerGetPayload<{
  include: { account: true; user: true };
}>;

class Seller {
  async createNewSeller(
    userId: string,
    accountId: string,
    log = true,
  ): Promise<iSellerPayload> {
    const userLoaded = (await Prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) as iUser;

    const stripeAccount = await StripePayments.createAccount(userLoaded.email);

    const onboardingLink = await StripePayments.getOnboardingLink(
      stripeAccount.id,
    );

    const seller = await Prisma.seller.create({
      data: {
        stripeId: stripeAccount.id,
        stripeChargesEnabled: stripeAccount.charges_enabled,
        type: stripeAccount.type,
        stripePayoutsEnabled: stripeAccount.payouts_enabled,
        stripeOnboardingLink: onboardingLink.url,
        stripeDetailsSubmitted: stripeAccount.details_submitted,
        user: {
          connect: {
            email: userLoaded.email,
          },
        },
        account: {
          connect: {
            id: accountId,
          },
        },
      },
      include: {
        account: true,
        user: true,
      },
    });

    Email.sendTransacionalEmail(
      userLoaded.email,
      "Ative sua conta de pagamentos. | Neex Club",
      <ActivateStripe user={userLoaded} url={onboardingLink.url} />,
      log,
    );

    return seller;
  }
}

export default new Seller();
