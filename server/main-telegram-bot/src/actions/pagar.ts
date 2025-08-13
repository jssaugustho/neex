import { Context } from "telegraf";
import t from "../libs/i18n";

export default async function pagarAction(ctx: Context, amount: number) {
  await ctx.reply(t("pt", "processing"));

  await ctx.replyWithPhoto(
    { source: Buffer.from(payment.qrCodeBase64, "base64") },
    {
      caption: `${t("pt", "payment_instructions")}\n\n${payment.qrCode}`,
    },
  );

  await ctx.reply(
    `✅ Pagamento via Pix!\n\n*Copie e cole no seu app bancário:*\n\`\`\`\n${payment.qrCode}\n\`\`\``,
    { parse_mode: "Markdown" },
  );
}
