export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: Record<string, Currency> = {
  "pt-br": { code: "brl", symbol: "R$", name: "Real" },
  "en-us": { code: "usd", symbol: "$", name: "US Dollar" },
  "en-gb": { code: "gbp", symbol: "£", name: "British Pound" },
  "en-ca": { code: "cad", symbol: "C$", name: "Canadian Dollar" },
  "de-de": { code: "eur", symbol: "€", name: "Euro" },
  "fr-fr": { code: "eur", symbol: "€", name: "Euro" },
  "es-mx": { code: "mxn", symbol: "MX$", name: "Peso Mexicano" },
  "ja-jp": { code: "jpy", symbol: "¥", name: "円" },
};
