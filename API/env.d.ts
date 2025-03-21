// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    CRYPTOGRAPHY_SECRET: string;
    CRYPTOGRAPHY_IV: string;
  }
}
