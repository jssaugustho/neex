// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    API_URL: string;
    SPA_URL: string;
    CORE_API_ADDRESS: string;
    CORE_API_PORT: string;
    WEB_CLIENT_ADDRESS: string;
    WEB_CLIENT_PORT: string;
  }
}
