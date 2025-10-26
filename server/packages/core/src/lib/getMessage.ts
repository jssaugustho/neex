import enUS from "../locales/en-US.js";
import ptBR from "../locales/pt-BR.js";

const messages = {
  "pt-BR": ptBR,
  "pt-br": ptBR,
  "en-US": enUS,
  "en-us": enUS,
};

export function getMessage(
  key: string,
  locale = "pt-BR",
  variables: Record<string, string | number> = {},
) {
  const font = messages[locale] || messages["pt-BR"];

  const message = font[key] || "Chave de resposta inválida: " + key;

  if (!message) return key;

  return Object.entries(variables).reduce(
    (msg, [variable, value]) => msg.replace(`{{${variable}}}`, String(value)),
    message,
  );
}
