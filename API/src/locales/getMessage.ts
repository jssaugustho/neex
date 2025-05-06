import ptBR from "./pt-BR.json" assert { type: "json" };

const messages = {
  "pt-BR": ptBR,
};

export function getMessage(
  key: string,
  locale = "pt-BR",
  variables: Record<string, string | number> = {}
) {
  const message =
    messages[locale][key] ||
    messages["pt-BR"][key] ||
    `Chave de resposta inválida: ${key}`;

  if (!message) return key;

  return Object.entries(variables).reduce(
    (msg, [variable, value]) => msg.replace(`{{${variable}}}`, String(value)),
    message
  );
}
