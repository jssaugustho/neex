import { Telegraf } from "telegraf";
import express from "express";
import bodyParser from "body-parser";
import startAction from "./actions/start";
import planosAction from "./actions/planos";
import pagarAction from "./actions/pagar";
import { log } from "console";
import dotenv from "dotenv";

dotenv.config();

console.log("Initializing...");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Comando /start
bot.start(startAction);

bot.catch(async (err, ctx) => {
  await ctx.reply("Erro inesperado, tente novamente mais tarde.");
  console.log("Erro: " + err);
});

// Ações
bot.action("comprar", planosAction);

bot.action("plan_daily", (ctx) =>
  pagarAction(ctx, parseFloat(process.env.PRICE_DAILY!)),
);

bot.action("plan_weekly", (ctx) =>
  pagarAction(ctx, parseFloat(process.env.PRICE_WEEKLY!)),
);

bot.action("plan_monthly", (ctx) =>
  pagarAction(ctx, parseFloat(process.env.PRICE_MONTHLY!)),
);

bot.action("plan_quarterly", (ctx) =>
  pagarAction(ctx, parseFloat(process.env.PRICE_QUARTERLY!)),
);

bot.action("start", startAction);

// Inicializa bot
bot.launch();

// Express para Webhook Mercado Pago
const app = express();

app.use(bodyParser.json());

app.post("/webhook-pix-mp", async (req, res) => {
  const data = req.body;

  if (data.type === "payment") {
    const paymentId = data.data.id;
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}` },
      },
    );
    const payment = await response.json();

    if (payment.status === "approved") {
      console.log("Pagamento aprovado!", payment);
      // ➤ Aqui você pode atualizar no Prisma e liberar no grupo
    }
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT, () =>
  console.log(`Webhook listening on port ${process.env.PORT}`),
);
