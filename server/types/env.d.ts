// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    //core

    NODE_ENV: "development" | "production";

    CRYPTOGRAPHY_SECRET: string;

    DATABASE_URL: string;

    JOBS_DATABASE_URL: string;

    EMAIL_USER: string;
    RESEND_API_TOKEN: string;

    REMEMBER_EXPIRES_IN: string;
    NOT_REMEMBER_EXPIRES_IN: string;

    CORE_API_ADDRESS: string;
    CORE_API_PORT: string;

    WEB_CLIENT_ADDRESS: string;
    WEB_CLIENT_PORT: string;

    //bot

    BOT_TOKEN: string;
    SELLER_PIX: string;
    SELLER_PIX_TYPE: "EMAIL" | "CPF" | "CNPJ" | "RANDOM" | "CNPJ";
    ACCOUNT_USERNAME: string;
    ACCOUNT_ID: string;

    STRIPE_KEY: string;
    VIDEO_URL: string;
    PORT: string; // será string no process.env, pode converter para string depois

    PRICE_DAILY: string; // será string no process.env, pode converter para string depois
    PRICE_WEEKLY: string;
    PRICE_MONTHLY: string;
    PRICE_QUARTERLY: string;

    GROUP_ID: string;
    CURRENCY: "BRL";
  }
}
