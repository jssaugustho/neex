// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    EMAIL_USER: string;
    RESEND_API_TOKEN: string;
    DATABASE_URL: string;
  }
}
