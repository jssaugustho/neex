// countries-lib.ts
// Lib em arquivo único. Escalável via array COUNTRIES.

export type PaymentMethod = {
  slug: string;
  uiName: string;
};

export type Country = {
  /** Identificador curto e estável para usar em rotas/chaves */
  slug: string; // ex.: "us", "br"
  /** Nome pronto para UI, já com emoji da bandeira */
  uiName: string; // ex.: "🇺🇸 United States", "🇧🇷 Brasil"
  /** Locale ISO (IETF BCP 47) principal do país */
  locale: string; // ex.: "en-US", "pt-BR"
  /** Moeda ISO 4217 única por país */
  currency: string; // ex.: "USD", "BRL"
  /** Nome da moeda pra ui */
  currencyName: string;
  /** Língua principal (ISO 639-1) única por país */
  language: string; // ex.: "en", "pt"

  paymentMethods: PaymentMethod[];
};

/**
 * Base de países suportados (uma língua e uma moeda por país).
 * Para escalar, apenas adicione novos itens aqui.
 */
export const COUNTRIES: Country[] = [
  // 🇺🇸 United States
  {
    slug: "us",
    uiName: "🇺🇸 United States (USD)",
    currencyName: "🇺🇸 USD",
    locale: "en-US",
    currency: "usd",
    language: "en",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 Pay with Credit/Debit Card (Stripe)" },
    ],
  },

  // 🇧🇷 Brasil
  {
    slug: "br",
    uiName: "🇧🇷 Brasil (BRL)",
    currencyName: "🇧🇷 BRL",
    locale: "pt-BR",
    currency: "brl",
    language: "pt",
    paymentMethods: [
      { slug: "pix", uiName: "💳 Pagar com Pix" },
      { slug: "stripe", uiName: "💳 Pagar com Cartão (Stripe)" },
    ],
  },

  // 🇬🇧 United Kingdom
  {
    slug: "gb",
    uiName: "🇬🇧 United Kingdom (GBP)",
    currencyName: "🇬🇧 GBP",
    locale: "en-GB",
    currency: "gbp",
    language: "en",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 Pay with Credit/Debit Card (Stripe)" },
    ],
  },

  // 🇨🇦 Canada
  {
    slug: "ca",
    uiName: "🇨🇦 Canada (CAD)",
    currencyName: "🇨🇦 CAD",
    locale: "en",
    currency: "cad",
    language: "en",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 Pay with Credit/Debit Card (Stripe)" },
    ],
  },

  // 🇩🇪 Deutschland (Germany)
  {
    slug: "de",
    uiName: "🇩🇪 Deutschland (EUR)",
    currencyName: "🇩🇪 EUR",
    locale: "de",
    currency: "eur",
    language: "de",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 Mit Karte bezahlen (Stripe)" },
    ],
  },

  // 🇫🇷 France
  {
    slug: "fr",
    uiName: "🇫🇷 France (EUR)",
    currencyName: "🇫🇷 EUR",
    locale: "fr",
    currency: "eur",
    language: "fr",
    paymentMethods: [{ slug: "stripe", uiName: "💳 Payer par carte (Stripe)" }],
  },

  // 🇦🇺 Australia
  {
    slug: "au",
    uiName: "🇦🇺 Australia (AUD)",
    currencyName: "🇦🇺 AUD",
    locale: "en",
    currency: "aud",
    language: "en",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 Pay with Credit/Debit Card (Stripe)" },
    ],
  },

  // 🇯🇵 日本 (Japan)
  {
    slug: "jp",
    uiName: "🇯🇵 日本 (JPY)",
    currencyName: "🇯🇵 JPY",
    locale: "ja",
    currency: "jpy",
    language: "ja",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 クレジットカードで支払う (Stripe)" },
    ],
  },

  // 🇰🇷 대한민국 (South Korea)
  {
    slug: "kr",
    uiName: "🇰🇷 대한민국 (KRW)",
    currencyName: "🇰🇷 KRW",
    locale: "ko",
    currency: "krw",
    language: "ko",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 신용/체크카드로 결제 (Stripe)" },
    ],
  },

  // 🇮🇹 Italia (Italy)
  {
    slug: "it",
    uiName: "🇮🇹 Italia (EUR)",
    currencyName: "🇮🇹 EUR",
    locale: "it",
    currency: "eur",
    language: "it",
    paymentMethods: [{ slug: "stripe", uiName: "💳 Paga con carta (Stripe)" }],
  },

  // 🇪🇸 España (Spain)
  {
    slug: "es",
    uiName: "🇪🇸 España (EUR)",
    currencyName: "🇪🇸 EUR",
    locale: "es",
    currency: "eur",
    language: "es",
    paymentMethods: [
      { slug: "stripe", uiName: "💳 Pagar con tarjeta (Stripe)" },
    ],
  },
];

/**
 * Aliases de locale que podem vir do Telegram (ou de configs do usuário)
 * e que devem mapear para um país específico. Útil para aceitar variações
 * como "en", "en_us", "pt", "pt_br", etc.
 *
 * Para escalar, adicione entradas no formato <locale-normalizada> -> <slug>.
 */
const LOCALE_ALIASES: Record<string, Country["slug"]> = {
  // Inglês → EUA
  en: "us",
  "en-us": "us",
  en_us: "us",
  // Português → Brasil
  pt: "br",
  "pt-br": "br",
  pt_br: "br",
};

/** País padrão (fallback) quando nada é encontrado */
const DEFAULT_COUNTRY_SLUG: Country["slug"] = "us";

/** Índices auxiliares para buscas rápidas */
const INDEX_BY_SLUG: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.slug, c]),
);

const INDEX_BY_LOCALE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [normalizeLocale(c.locale), c]),
);

/** Normaliza locale: lower-case, troca '_' por '-', remove espaços. */
function normalizeLocale(input: string): string {
  return (input || "").trim().replace(/_/g, "-").toLowerCase();
}

/**
 * Tenta encontrar um Country a partir de uma string de locale (vinda do Telegram).
 * Estratégia:
 * 1) Normaliza e tenta match exato no índice por locale (ex.: "pt-BR" → "pt-br").
 * 2) Procura em LOCALE_ALIASES (ex.: "pt" → "br").
 * 3) Se a locale vier só com língua (ex.: "en"), tenta casar pelo campo language.
 * 4) Fallback: retorna país padrão (EUA).
 */
export function getCountryByLocale(
  telegramLocale: string | undefined | null,
): Country {
  const norm = normalizeLocale(telegramLocale ?? "");

  // (1) match exato no índice de locales oficiais
  const exact = INDEX_BY_LOCALE[norm];
  if (exact) return exact;

  // (2) alias explícito
  const aliasSlug = LOCALE_ALIASES[norm];
  if (aliasSlug && INDEX_BY_SLUG[aliasSlug]) return INDEX_BY_SLUG[aliasSlug];

  // (3) tentativa por linguagem base (parte antes do '-')
  if (norm) {
    const langOnly = norm.split("-")[0];
    const byLang = COUNTRIES.find((c) => c.language.toLowerCase() === langOnly);
    if (byLang) return byLang;
  }

  // (4) fallback EUA
  return INDEX_BY_SLUG[DEFAULT_COUNTRY_SLUG];
}

/**
 * Retorna informações amigáveis para UI com base na locale recebida:
 * locale, moeda e nome com bandeira.
 * Sempre garante retorno válido, caindo para EUA se não encontrar.
 */
export function getUiInfoByLocale(
  telegramLocale: string | undefined | null,
): Country {
  return getCountryByLocale(telegramLocale);
}

/**
 * Retorna as informações completas do país com base na slug.
 * Se não encontrar a slug, retorna o país padrão (EUA).
 */
export function getCountryBySlug(slug: string | undefined | null): Country {
  const key = (slug || "").trim().toLowerCase();
  return INDEX_BY_SLUG[key] ?? INDEX_BY_SLUG[DEFAULT_COUNTRY_SLUG];
}

/* ------------------------------------------------------------------
   SUPPORTED SLUGS (sem duplicatas) + helpers
   ------------------------------------------------------------------ */

/** Retorna a lista de slugs suportadas (sem duplicatas). */
export function getSupportedSlugs(): ReadonlyArray<Country["slug"]> {
  return Object.freeze(Array.from(new Set(COUNTRIES.map((c) => c.slug))));
}

/** Versão imutável da lista de slugs suportadas (snapshot). */
export const SUPPORTED_SLUGS: ReadonlyArray<Country["slug"]> =
  getSupportedSlugs();

/** Type guard útil para validar entrada externa. */
export function isSupportedSlug(slug: string): slug is Country["slug"] {
  return SUPPORTED_SLUGS.includes(slug as Country["slug"]);
}

/* ------------------------------------------------------------------
   Construtores de RegEx dinâmicos
   ------------------------------------------------------------------ */

/** Cria uma RegExp do tipo ^route/(a|b|c)$ a partir de uma lista de variáveis. */
export function makeRegex(
  route: string,
  variables: string[],
  productId = false,
): RegExp {
  return new RegExp(
    `^${route}\\/(${variables.join("|")})${productId ? "/([a-f0-9]{24})" : ""}$`,
  ); // ^plans/(brl|eur|usd)$
}

/** Atalho: usa todas as slugs suportadas para montar a RegExp. */
export function makeRegexFromSupportedSlugs(
  route: string,
  productId = false,
): RegExp {
  return makeRegex(route, SUPPORTED_SLUGS as string[], productId);
}

/* ============================
   EXEMPLOS DE USO (remova em prod)
   ============================

const a = getCountryByLocale("pt-BR");
// -> { slug: 'br', uiName: '🇧🇷 Brasil', locale: 'pt-BR', currency: 'BRL', language: 'pt' }

const b = getUiInfoByLocale("en");
// -> { locale: 'en-US', currency: 'USD', uiName: '🇺🇸 United States', slug: 'us', language: 'en' }

const c = getCountryBySlug("br");
// -> { locale: 'pt-BR', uiName: '🇧🇷 Brasil', currency: 'BRL', language: 'pt', slug: 'br' }

const slugs = getSupportedSlugs();
// -> ["us", "br"]

const rx = makeRegexFromSupportedSlugs("countries");
// -> /^countries\/(us|br)$/

*/
