declare namespace NodeJS {
  interface ProcessEnv {
    BOT_TOKEN: string;
    MP_ACCESS_TOKEN: string;
    VIDEO_URL: string;
    PORT: string; // será string no process.env, pode converter para number depois

    PRICE_DAILY: string; // será string no process.env, pode converter para number depois
    PRICE_WEEKLY: string;
    PRICE_MONTHLY: string;
    PRICE_QUARTERLY: string;

    GROUP_ID: string;
    CURRENCY: "BRL"; // valor fixo BRL
  }
}
