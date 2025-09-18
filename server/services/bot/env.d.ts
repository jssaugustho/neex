declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    BOT_TOKEN: string;
    WEBHOOK_PORT: string;
  }
}
