import locales from "../locales/locales.js";

export function getMessage(
  key: string,
  locale = "pt-BR",
  variables: Record<string, string | number> = {},
) {
  const font = locales[locale] || locales["en-US"];

  const message = font[key] || "Chave de resposta inválida: " + key;

  if (!message) return key;

  return Object.entries(variables).reduce(
    (msg, [variable, value]) => msg.replace(`{{${variable}}}`, String(value)),
    message,
  );
}
