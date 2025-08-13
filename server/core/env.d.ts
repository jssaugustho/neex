// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    API_URL: string;
    SPA_URL: string;
    JWT_SECRET: string;
    JWT_VERIFICATION_SECRET: String;
    JWT_REFRESH_SECRET: string;
    CRYPTOGRAPHY_SECRET: string;
    CRYPTOGRAPHY_IV: string;
    DATABASE_URL: string;
    JOBS_DATABASE_URL: string;
    EMAIL_USER: string;
    RESEND_API_TOKEN: string;
    REMEMBER_EXPIRES_IN: number;
    NOT_REMEMBER_EXPIRES_IN: number;
    CORE_API_ADDRESS: string;
    CORE_API_PORT: number;
    WEB_CLIENT_ADDRESS: string;
    WEB_CLIENT_PORT: number;
  }
}
