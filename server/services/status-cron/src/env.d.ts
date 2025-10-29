// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    EMAIL_USER: string;
    RESEND_API_TOKEN: string;
    DATABASE_URL: string;
    API_URL: string;
    WEB_CLIENT_URL: string;
    TELEGRAM_WEBHOOK_URL: string;
    WEBHOOKS_URL: string;
    EMAIL_QUEUE_URL: string;
    MGMT_BOT_ID: string;
  }
}
