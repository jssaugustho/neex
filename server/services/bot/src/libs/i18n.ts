import enUS from "../locales/en-US.json" with { type: "json" };
import ptBR from "../locales/pt-BR.json" with { type: "json" };
import enCA from "../locales/en-CA.json" with { type: "json" };
import enGB from "../locales/en-GB.json" with { type: "json" };
import enAU from "../locales/en-AU.json" with { type: "json" };
import deDE from "../locales/de-DE.json" with { type: "json" };
import esES from "../locales/es-ES.json" with { type: "json" };
import frFR from "../locales/fr-FR.json" with { type: "json" };
import itIt from "../locales/it-IT.json" with { type: "json" };
import jaJP from "../locales/ja-JP.json" with { type: "json" };
import koKR from "../locales/ko-KR.json" with { type: "json" };

const locales = {};

locales["en"] = enUS;
locales["pt-BR"] = ptBR;
locales["en"] = enCA;
locales["en-GB"] = enGB;
locales["en"] = enAU;
locales["de"] = deDE;
locales["es"] = esES;
locales["fr"] = frFR;
locales["it"] = itIt;
locales["ja"] = jaJP;
locales["ko"] = koKR;

export const allowedLocales = Object.keys(locales);
export type SupportedLocales = (typeof allowedLocales)[number];
export const defaultLocale: SupportedLocales = "en-us";

export default function t(
  locale: SupportedLocales,
  key: string,
  vars: Record<string, any> = {},
) {
  const keys = key.split(".");
  let text: any = locales[locale] || locales["en-US"];
  for (const k of keys) text = text[k];
  if (!text) return key;
  Object.keys(vars).forEach((v) => (text = text.replace(`\${${v}}`, vars[v])));
  return text;
}
