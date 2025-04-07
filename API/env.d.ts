// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    API_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    CRYPTOGRAPHY_SECRET: string;
    CRYPTOGRAPHY_IV: string;
    DATABASE_URL: string;
    JOBS_DATABASE_URL: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    EMAIL_USER: string;
    EMAIL_PASSWD: string;
  }
}
