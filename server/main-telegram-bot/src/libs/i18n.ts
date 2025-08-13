import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Locale = "pt";
const locales: Record<Locale, any> = {
  pt: JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../locales/pt.json"), "utf-8"),
  ),
};

export default function t(
  locale: Locale,
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
