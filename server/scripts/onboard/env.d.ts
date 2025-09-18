declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    STRIPE_KEY: string;
    NEEX_DEV_SESSION_ID: string;
  }
}
