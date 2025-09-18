import enUS from "../../locales/en-US.json" with { type: "json" };
import ptBR from "../../locales/pt-BR.json" with { type: "json" };

const locales = {};

locales["en-us"] = enUS;
locales["pt-br"] = ptBR;

export const allowedLocales = Object.keys(locales);
export type SupportedLocales = (typeof allowedLocales)[number];
export const defaultLocale: SupportedLocales = "en-us";

export default function t(
  locale: SupportedLocales,
  key: string,
  vars: Record<string, any> = {},
) {
  const keys = key.split(".");
  let text: any = locales[locale];
  for (const k of keys) text = text[k];
  if (!text) return key;
  Object.keys(vars).forEach((v) => (text = text.replace(`\${${v}}`, vars[v])));
  return text;
}
