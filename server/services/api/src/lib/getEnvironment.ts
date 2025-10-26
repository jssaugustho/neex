import Core from "../core/core.js";

const { Logger } = Core;

const obrigatoryValues = [
  "NODE_ENV",
  "CRYPTOGRAPHY_SECRET",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_VERIFICATION_SECRET",
  "REMEMBER_EXPIRES_IN",
  "NOT_REMEMBER_EXPIRES_IN",
  "SMTP_USER",
  "RESEND_API_TOKEN",
  "PAGAR_ME_KEY",
  "STRIPE_KEY",
  "NEEX_DEV_SESSION_ID",
  "WEB_CLIENT_URL",
  "API_URL",
  "EMAIL_USER",
  "STRIPE_WEBHOOK_SECRET",
];

function getEnvironment(env: NodeJS.ProcessEnv) {
  obrigatoryValues.forEach((value) => {
    if (!env[value]) {
      Logger.error(`Environment Variable Not Found: ${value}`);

      process.exit(1);
    }
  });
}

export default getEnvironment;
