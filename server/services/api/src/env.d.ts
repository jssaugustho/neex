// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    API_URL: string;
    WEB_CLIENT_URL: string;
    BOT_URL: string;
    API_PORT: string;
    JWT_SECRET: string;
    JWT_VERIFICATION_SECRET: string;
    JWT_REFRESH_SECRET: string;
    CRYPTOGRAPHY_SECRET: string;
    DATABASE_URL: string;
    SMTP_USER: string;
    RESEND_API_TOKEN: string;
    REMEMBER_EXPIRES_IN: string;
    NOT_REMEMBER_EXPIRES_IN: string;
    STRIPE_KEY: string;
    STRIPE_WEBHOOK_TOKEN: string;
  }
}
