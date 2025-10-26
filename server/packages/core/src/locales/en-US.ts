const enUS = {
  invalidSession: "Invalid session.",
  sessionNotFound: "Session not found.",
  noSessionsFound: "No sessions found.",
  sessionFound: "Session found.",
  sessionsFound: "{{count}} sessions found.",

  noInactivatedSessions: "No sessions found.",
  inactivatedSession: "Logout successful.",
  inactivatedSessions: "{{count}} sessions successfully deactivated.",

  inactiveSession: "Inactive session.",

  noBlockedSession: "No blocked sessions.",
  blockSession: "Session successfully blocked.",
  blockSessions: "{{count}} sessions successfully blocked.",
  blockedSession: "Inactive session.",

  logoutSession: "Logout successful.",

  noUnauthorizedIp: "No authorization revoked.",
  unauthorizedIp: "IP address authorization revoked.",
  unauthorizedIps: "{{count}} IP addresses had their authorizations revoked.",
  ipNotFound: "IP address not found.",

  userNotFound: "User not found.",
  noUsersFound: "No users found.",
  userFound: "User found.",
  usersFound: "{{count}} users found.",

  newUserCreated: "New user successfully created.",

  emailVerified: "Email successfully verified.",
  emailNotVerified: "Email not verified.",
  needEmail2fa: "Check your email to continue.",

  waitToResendEmail: "Please wait before resending the email.",

  successAuthentication: "Authentication successful.",
  successPreAuthentication: "Pre-authentication successful.",
  failAuthentication: "Authentication failed.",
  wrongPassword: "Incorrect password.",

  unauthorized: "Unauthorized.",
  attemptLimit: "Login via email required.",
  requirePrivilege: "Requires privileges: {{privilege}}.",
  ownerSupportOrAdmin: "Owner, support, or administrator.",

  obrigatoryHeaders: "Invalid HTTP headers.",
  obrigatoryParams: "Missing required parameters.",

  invalidParams: "Invalid parameters.",
  invalidQuery: "Invalid query.",
  invalidEmail: "Invalid email address.",
  invalidPhone: "Invalid phone number.",
  invalidPassword: "Invalid password.",
  emailInUse: "Email already in use.",
  phoneInUse: "Phone number already in use.",
  invalidHeaders: "Invalid HTTP headers.",
  easyPassword: "Weak password.",

  sendedEmail: "Email sent successfully.",
  emailAlreadyVerified: "Email already verified.",
  needVerifyEmail: "Please verify your email.",

  invalidToken: "Invalid token.",

  invalidRefreshToken: "Invalid refresh token.",

  cantDecodeToken: "Unable to decode token.",
  invalidTokenType: "Invalid token type, requires type {{type}}.",

  unauthorizedSession: "Session not authenticated. Please log in again.",

  cantDecodeRefreshToken: "Unable to decode token.",
  invalidRefreshTokenType:
    "Invalid refresh token type, requires type {{type}}.",

  invalidTokenPayload: "Invalid token payload, missing: {{lost}}",

  verificationTokenNotFound: "Verification token not found.",

  invalidVerificationToken:
    "Invalid verification token. Resend the email and try again.",
  cantDecodeVerificationToken: "Unable to decode token.",
  invalidVerificationTokenType:
    "Invalid verification token type, requires type {{type}}.",

  joinGroup: "Click the link below to join the VIP group.",
  joinGroupCTA: "Join the group ➡️",
  retryStart: "Purchase again ⬅️",

  telegramSellerNotification:
    "💸 <b>Sale confirmed!</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>Error detected!</b>\n\n🏷️ Account: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>Expired subscription detected!</b>\n\n🏷️ Seller: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n👤 Username: <b>{{leadName}}</b>\n📅 Expired on: <b>{{expiresAt}}</b>\n\n🧹 The user was automatically removed from the group.",

  eur: "💶 EUR (Euro) {{price}}",
  usd: "💵 USD (Dollar) {{price}}",
  brl: "🇧🇷 BRL (Real) {{price}}",
} as const;

export default enUS;
