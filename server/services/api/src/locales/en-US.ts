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
  needEmail2fa: "Check your email.",

  waitToResendEmail: "Please wait before resending the email.",

  invalidToken: "Invalid token.",

  invalidRefreshToken: "Invalid refresh token.",

  successAuthentication: "Authentication successful.",
  successLogin: "Login successful.",
  failAuthentication: "Authentication failed.",
  wrongPassword: "Incorrect password.",

  unauthorized: "Unauthorized.",
  attemptLimit: "Attempt limit reached.",
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

  sendedEmail: "Email sent.",
  emailAlreadyVerified: "Email already verified.",

  requiresOldPasswd: "Incorrect old password.",
  tokenVerified: "Token successfully verified.",
  changedPasswd: "Password successfully reset.",
} as const;

export default enUS;
