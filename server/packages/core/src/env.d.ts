declare namespace NodeJS {
  interface ProcessEnv {
    // setup variables
    ACCOUNT_NAME: string;

    // core api env
    NODE_ENV: "development" | "production" | "test";
    CRYPTOGRAPHY_SECRET: string;
    DATABASE_URL: string;

    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_VERIFICATION_SECRET: string;

    REMEMBER_EXPIRES_IN: string;
    NOT_REMEMBER_EXPIRES_IN: string;

    SMTP_USER: string;
    RESEND_API_TOKEN: string;

    PAGAR_ME_KEY: string;

    STRIPE_KEY: string;

    NEEX_DEV_SESSION_ID: string;

    WEB_CLIENT_URL: string;
    ENV_FILE: string;
  }
}
