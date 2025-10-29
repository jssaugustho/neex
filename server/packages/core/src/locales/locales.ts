/* ===================== pt-BR ===================== */
export const ptBR = {
  invalidSession: "Sessão inválida.",
  sessionNotFound: "Sessão não encontrada.",
  noSessionsFound: "Nenhuma sessão encontrada.",
  sessionFound: "Sessão encontrada.",
  sessionsFound: "{{count}} sessões encontradas.",

  noInactivatedSessions: "Nenhuma sessão encontrada.",
  inactivatedSession: "Logout realizado com sucesso.",
  inactivatedSessions: "{{count}} sessões inativadas com sucesso.",

  inactiveSession: "Sessão inativa.",

  noBlockedSession: "Nenhuma sessão bloqueada.",
  blockSession: "Sessão bloqueada com sucesso.",
  blockSessions: "{{count}} sessões bloqueadas com sucesso.",
  blockedSession: "Sessão inativa.",

  logoutSession: "Logout realizado com sucesso.",

  noUnauthorizedIp: "Nenhuma autorização revogada.",
  unauthorizedIp: "Autorização do endereço IP revogada.",
  unauthorizedIps: "{{count}} endereços IP tiveram as autorizações revogadas.",
  ipNotFound: "Endereço IP não encontrado.",

  userNotFound: "Usuário não encontrado.",
  noUsersFound: "Nenhum usuário encontrado.",
  userFound: "Usuário encontrado.",
  usersFound: "{{count}} usuários encontrados.",

  newUserCreated: "Novo usuário criado com sucesso.",

  emailVerified: "E-mail verificado com sucesso.",
  emailNotVerified: "E-mail não verificado.",
  needEmail2fa: "Verifique seu email para continuar.",

  waitToResendEmail: "Aguarde o prazo de reenvio do e-mail.",

  successAuthentication: "Autenticação bem-sucedida.",
  successPreAuthentication: "Pré-autenticação bem-sucedida.",
  failAuthentication: "Falha na autenticação.",
  wrongPassword: "Senha incorreta.",

  unauthorized: "Não autorizado.",
  attemptLimit: "Faça o login através do email.",
  requirePrivilege: "Requer privilégios: {{privilege}}.",
  ownerSupportOrAdmin: "Proprietário, suporte ou administrador.",

  obrigatoryHeaders: "Cabeçalhos HTTP inválidos.",
  obrigatoryParams: "Parâmetros obrigatórios não informados.",

  invalidParams: "Parâmetros inválidos.",
  invalidQuery: "Consulta inválida.",
  invalidEmail: "E-mail inválido.",
  invalidPhone: "Número de celular inválido.",
  invalidPassword: "Senha inválida.",
  emailInUse: "E-mail já está em uso.",
  phoneInUse: "Número de celular já está em uso.",
  invalidHeaders: "Cabeçalhos HTTP inválidos.",
  easyPassword: "Senha fraca.",

  sendedEmail: "Email enviado com sucesso.",
  emailAlreadyVerified: "E-mail já verificado.",
  needVerifyEmail: "Verifique o seu email.",

  invalidToken: "Token inválido.",

  invalidRefreshToken: "Refresh token inválido.",

  cantDecodeToken: "Não foi possível decodificar o token.",
  invalidTokenType: "Tipo de token inválido, requer um tipo {{type}}.",

  unauthorizedSession: "A sessão não está autenticada, faça o login novamente.",

  cantDecodeRefreshToken: "Não foi possível decodificar o token.",
  invalidRefreshTokenType: "Tipo de token inválido, requer um tipo {{type}}.",

  invalidTokenPayload: "Payload do token inválido, falta: {{lost}}",

  verificationTokenNotFound: "Token de verificação não encontrado.",

  invalidVerificationToken:
    "Token de verificação inválido, faça o reenvio do e-mail e tente novamente.",
  cantDecodeVerificationToken: "Não foi possível decodificar o token.",
  invalidVerificationTokenType:
    "Tipo de token de verificação inválido, requer um tipo {{type}}.",

  joinGroup: "Clique no link abaixo para entrar no grupo VIP.",
  joinGroupCTA: "Entrar no grupo ➡️",
  retryStart: "Comprar novamente ⬅️",

  telegramSellerNotification:
    "💸 <b>Venda confirmada!</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>Erro detectado!</b>\n\n🏷️ Conta: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>Assinatura expirada detectada!</b>\n\n🏷️ Vendedor: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n👤 Username: <b>{{leadName}}</b>\n📅 Expirou em: <b>{{expiresAt}}</b>\n\n🧹 O usuário foi removido do grupo automaticamente.",

  serviceCrash: "❌ <b>[CRÍTICO]</b> Serviço indisponível: {{slug}}",

  usd: "💵 USD (Dólar Americano) {{price}}",
  eur: "💶 EUR (Euro) {{price}}",
  brl: "🇧🇷 BRL (Real Brasileiro) {{price}}",
  cad: "🇨🇦 CAD (Dólar Canadense) {{price}}",
  gbp: "💷 GBP (Libra Esterlina) {{price}}",
  aud: "🇦🇺 AUD (Dólar Australiano) {{price}}",
  jpy: "💴 JPY (Iene Japonês) {{price}}",
  krw: "🇰🇷 KRW (Won Sul-Coreano) {{price}}",
} as const;

/* ===================== en-US ===================== */
export const enUS = {
  invalidSession: "Invalid session.",
  sessionNotFound: "Session not found.",
  noSessionsFound: "No sessions found.",
  sessionFound: "Session found.",
  sessionsFound: "{{count}} sessions found.",

  noInactivatedSessions: "No sessions found.",
  inactivatedSession: "Logout successful.",
  inactivatedSessions: "{{count}} sessions successfully inactivated.",

  inactiveSession: "Inactive session.",

  noBlockedSession: "No blocked sessions.",
  blockSession: "Session blocked successfully.",
  blockSessions: "{{count}} sessions blocked successfully.",
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

  newUserCreated: "New user created successfully.",

  emailVerified: "Email verified successfully.",
  emailNotVerified: "Email not verified.",
  needEmail2fa: "Check your email to continue.",

  waitToResendEmail: "Please wait before resending the email.",

  successAuthentication: "Authentication successful.",
  successPreAuthentication: "Pre-authentication successful.",
  failAuthentication: "Authentication failed.",
  wrongPassword: "Incorrect password.",

  unauthorized: "Unauthorized.",
  attemptLimit: "Log in via email.",
  requirePrivilege: "Requires privilege(s): {{privilege}}.",
  ownerSupportOrAdmin: "Owner, support or administrator.",

  obrigatoryHeaders: "Invalid HTTP headers.",
  obrigatoryParams: "Missing required parameters.",

  invalidParams: "Invalid parameters.",
  invalidQuery: "Invalid query.",
  invalidEmail: "Invalid email.",
  invalidPhone: "Invalid phone number.",
  invalidPassword: "Invalid password.",
  emailInUse: "Email is already in use.",
  phoneInUse: "Phone number is already in use.",
  invalidHeaders: "Invalid HTTP headers.",
  easyPassword: "Weak password.",

  sendedEmail: "Email sent successfully.",
  emailAlreadyVerified: "Email already verified.",
  needVerifyEmail: "Verify your email.",

  invalidToken: "Invalid token.",

  invalidRefreshToken: "Invalid refresh token.",

  cantDecodeToken: "Could not decode token.",
  invalidTokenType: "Invalid token type, expected {{type}}.",

  unauthorizedSession: "The session is not authenticated. Please log in again.",

  cantDecodeRefreshToken: "Could not decode token.",
  invalidRefreshTokenType: "Invalid token type, expected {{type}}.",

  invalidTokenPayload: "Invalid token payload, missing: {{lost}}",

  verificationTokenNotFound: "Verification token not found.",

  invalidVerificationToken:
    "Invalid verification token. Resend the email and try again.",
  cantDecodeVerificationToken: "Could not decode token.",
  invalidVerificationTokenType:
    "Invalid verification token type, expected {{type}}.",

  joinGroup: "Click the link below to join the VIP group.",
  joinGroupCTA: "Join the group ➡️",
  retryStart: "Buy again ⬅️",

  telegramSellerNotification:
    "💸 <b>Sale confirmed!</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>Error detected!</b>\n\n🏷️ Account: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>Expired subscription detected!</b>\n\n🏷️ Seller: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n👤 Username: <b>{{leadName}}</b>\n📅 Expired on: <b>{{expiresAt}}</b>\n\n🧹 The user has been automatically removed from the group.",

  usd: "💵 USD (US Dollar) {{price}}",
  eur: "💶 EUR (Euro) {{price}}",
  brl: "🇧🇷 BRL (Brazilian Real) {{price}}",
  cad: "🇨🇦 CAD (Canadian Dollar) {{price}}",
  gbp: "💷 GBP (Pound Sterling) {{price}}",
  aud: "🇦🇺 AUD (Australian Dollar) {{price}}",
  jpy: "💴 JPY (Japanese Yen) {{price}}",
  krw: "🇰🇷 KRW (South Korean Won) {{price}}",
} as const;

/* ===================== en-CA ===================== */
export const enCA = {
  ...enUS,
} as const;

/* ===================== en-GB ===================== */
export const enGB = {
  ...enUS,
  wrongPassword: "Incorrect password.",
  ownerSupportOrAdmin: "Owner, support or administrator.",
  eur: "💶 EUR (Euro) {{price}}",
  usd: "💵 USD (US Dollar) {{price}}",
  brl: "🇧🇷 BRL (Brazilian Real) {{price}}",
} as const;

/* ===================== en-AU ===================== */
export const enAU = {
  ...enUS,
} as const;

/* ===================== de-DE ===================== */
export const deDE = {
  invalidSession: "Ungültige Sitzung.",
  sessionNotFound: "Sitzung nicht gefunden.",
  noSessionsFound: "Keine Sitzungen gefunden.",
  sessionFound: "Sitzung gefunden.",
  sessionsFound: "{{count}} Sitzungen gefunden.",

  noInactivatedSessions: "Keine Sitzungen gefunden.",
  inactivatedSession: "Abmeldung erfolgreich.",
  inactivatedSessions: "{{count}} Sitzungen erfolgreich deaktiviert.",

  inactiveSession: "Inaktive Sitzung.",

  noBlockedSession: "Keine blockierten Sitzungen.",
  blockSession: "Sitzung erfolgreich blockiert.",
  blockSessions: "{{count}} Sitzungen erfolgreich blockiert.",
  blockedSession: "Inaktive Sitzung.",

  logoutSession: "Abmeldung erfolgreich.",

  noUnauthorizedIp: "Keine Autorisierung widerrufen.",
  unauthorizedIp: "Autorisierung der IP-Adresse widerrufen.",
  unauthorizedIps:
    "Für {{count}} IP-Adressen wurden die Berechtigungen widerrufen.",
  ipNotFound: "IP-Adresse nicht gefunden.",

  userNotFound: "Benutzer nicht gefunden.",
  noUsersFound: "Keine Benutzer gefunden.",
  userFound: "Benutzer gefunden.",
  usersFound: "{{count}} Benutzer gefunden.",

  newUserCreated: "Neuer Benutzer erfolgreich erstellt.",

  emailVerified: "E-Mail erfolgreich verifiziert.",
  emailNotVerified: "E-Mail nicht verifiziert.",
  needEmail2fa: "Überprüfen Sie Ihre E-Mail, um fortzufahren.",

  waitToResendEmail: "Bitte warten Sie, bevor Sie die E-Mail erneut senden.",

  successAuthentication: "Authentifizierung erfolgreich.",
  successPreAuthentication: "Vorab-Authentifizierung erfolgreich.",
  failAuthentication: "Authentifizierung fehlgeschlagen.",
  wrongPassword: "Falsches Passwort.",

  unauthorized: "Nicht autorisiert.",
  attemptLimit: "Melden Sie sich per E-Mail an.",
  requirePrivilege: "Erfordert Berechtigung(en): {{privilege}}.",
  ownerSupportOrAdmin: "Inhaber, Support oder Administrator.",

  obrigatoryHeaders: "Ungültige HTTP-Header.",
  obrigatoryParams: "Erforderliche Parameter fehlen.",

  invalidParams: "Ungültige Parameter.",
  invalidQuery: "Ungültige Abfrage.",
  invalidEmail: "Ungültige E-Mail.",
  invalidPhone: "Ungültige Telefonnummer.",
  invalidPassword: "Ungültiges Passwort.",
  emailInUse: "E-Mail wird bereits verwendet.",
  phoneInUse: "Telefonnummer wird bereits verwendet.",
  invalidHeaders: "Ungültige HTTP-Header.",
  easyPassword: "Schwaches Passwort.",

  sendedEmail: "E-Mail erfolgreich gesendet.",
  emailAlreadyVerified: "E-Mail bereits verifiziert.",
  needVerifyEmail: "Bitte E-Mail verifizieren.",

  invalidToken: "Ungültiges Token.",

  invalidRefreshToken: "Ungültiges Refresh-Token.",

  cantDecodeToken: "Token konnte nicht dekodiert werden.",
  invalidTokenType: "Ungültiger Tokentyp, erwartet: {{type}}.",

  unauthorizedSession: "Sitzung nicht authentifiziert. Bitte erneut anmelden.",

  cantDecodeRefreshToken: "Token konnte nicht dekodiert werden.",
  invalidRefreshTokenType: "Ungültiger Tokentyp, erwartet: {{type}}.",

  invalidTokenPayload: "Ungültige Token-Payload, fehlt: {{lost}}",

  verificationTokenNotFound: "Verifizierungstoken nicht gefunden.",

  invalidVerificationToken:
    "Ungültiger Verifizierungstoken. Senden Sie die E-Mail erneut und versuchen Sie es noch einmal.",
  cantDecodeVerificationToken: "Token konnte nicht dekodiert werden.",
  invalidVerificationTokenType:
    "Ungültiger Verifizierungstokentyp, erwartet: {{type}}.",

  joinGroup: "Klicke auf den Link unten, um der VIP-Gruppe beizutreten.",
  joinGroupCTA: "Der Gruppe beitreten ➡️",
  retryStart: "Erneut kaufen ⬅️",

  telegramSellerNotification:
    "💸 <b>Verkauf bestätigt!</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>Fehler erkannt!</b>\n\n🏷️ Konto: <b>{{account}}</b>\n🤖 Bot-ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>Abgelaufenes Abonnement erkannt!</b>\n\n🏷️ Verkäufer: <b>{{account}}</b>\n🤖 Bot-ID: <b>{{botId}}</b>\n👤 Benutzername: <b>{{leadName}}</b>\n📅 Abgelaufen am: <b>{{expiresAt}}</b>\n\n🧹 Der Benutzer wurde automatisch aus der Gruppe entfernt.",

  usd: "💵 USD (US-Dollar) {{price}}",
  eur: "💶 EUR (Euro) {{price}}",
  brl: "🇧🇷 BRL (Brasilianischer Real) {{price}}",
  cad: "🇨🇦 CAD (Kanadischer Dollar) {{price}}",
  gbp: "💷 GBP (Pfund Sterling) {{price}}",
  aud: "🇦🇺 AUD (Australischer Dollar) {{price}}",
  jpy: "💴 JPY (Japanischer Yen) {{price}}",
  krw: "🇰🇷 KRW (Südkoreanischer Won) {{price}}",
} as const;

/* ===================== es-ES ===================== */
export const esES = {
  invalidSession: "Sesión inválida.",
  sessionNotFound: "Sesión no encontrada.",
  noSessionsFound: "No se encontraron sesiones.",
  sessionFound: "Sesión encontrada.",
  sessionsFound: "{{count}} sesiones encontradas.",

  noInactivatedSessions: "No se encontraron sesiones.",
  inactivatedSession: "Cierre de sesión realizado con éxito.",
  inactivatedSessions: "{{count}} sesiones inactivadas con éxito.",

  inactiveSession: "Sesión inactiva.",

  noBlockedSession: "No hay sesiones bloqueadas.",
  blockSession: "Sesión bloqueada con éxito.",
  blockSessions: "{{count}} sesiones bloqueadas con éxito.",
  blockedSession: "Sesión inactiva.",

  logoutSession: "Cierre de sesión realizado con éxito.",

  noUnauthorizedIp: "Ninguna autorización revocada.",
  unauthorizedIp: "Autorización de la dirección IP revocada.",
  unauthorizedIps:
    "Se revocaron las autorizaciones de {{count}} direcciones IP.",
  ipNotFound: "Dirección IP no encontrada.",

  userNotFound: "Usuario no encontrado.",
  noUsersFound: "No se encontraron usuarios.",
  userFound: "Usuario encontrado.",
  usersFound: "{{count}} usuarios encontrados.",

  newUserCreated: "Nuevo usuario creado con éxito.",

  emailVerified: "Correo verificado con éxito.",
  emailNotVerified: "Correo no verificado.",
  needEmail2fa: "Revisa tu correo para continuar.",

  waitToResendEmail: "Espera antes de reenviar el correo.",

  successAuthentication: "Autenticación exitosa.",
  successPreAuthentication: "Pre-autenticación exitosa.",
  failAuthentication: "Autenticación fallida.",
  wrongPassword: "Contraseña incorrecta.",

  unauthorized: "No autorizado.",
  attemptLimit: "Inicia sesión a través del correo.",
  requirePrivilege: "Requiere privilegios: {{privilege}}.",
  ownerSupportOrAdmin: "Propietario, soporte o administrador.",

  obrigatoryHeaders: "Encabezados HTTP inválidos.",
  obrigatoryParams: "Faltan parámetros obligatorios.",

  invalidParams: "Parámetros inválidos.",
  invalidQuery: "Consulta inválida.",
  invalidEmail: "Correo inválido.",
  invalidPhone: "Número de celular inválido.",
  invalidPassword: "Contraseña inválida.",
  emailInUse: "El correo ya está en uso.",
  phoneInUse: "El número de celular ya está en uso.",
  invalidHeaders: "Encabezados HTTP inválidos.",
  easyPassword: "Contraseña débil.",

  sendedEmail: "Correo enviado con éxito.",
  emailAlreadyVerified: "Correo ya verificado.",
  needVerifyEmail: "Verifica tu correo.",

  invalidToken: "Token inválido.",

  invalidRefreshToken: "Refresh token inválido.",

  cantDecodeToken: "No se pudo decodificar el token.",
  invalidTokenType: "Tipo de token inválido, se espera {{type}}.",

  unauthorizedSession: "La sesión no está autenticada. Inicia sesión de nuevo.",

  cantDecodeRefreshToken: "No se pudo decodificar el token.",
  invalidRefreshTokenType: "Tipo de token inválido, se espera {{type}}.",

  invalidTokenPayload: "Payload de token inválido, falta: {{lost}}",

  verificationTokenNotFound: "Token de verificación no encontrado.",

  invalidVerificationToken:
    "Token de verificación inválido. Reenvía el correo e inténtalo de nuevo.",
  cantDecodeVerificationToken: "No se pudo decodificar el token.",
  invalidVerificationTokenType:
    "Tipo de token de verificación inválido, se espera {{type}}.",

  joinGroup: "Haz clic en el enlace de abajo para entrar al grupo VIP.",
  joinGroupCTA: "Entrar al grupo ➡️",
  retryStart: "Comprar de nuevo ⬅️",

  telegramSellerNotification:
    "💸 <b>¡Venta confirmada!</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>¡Error detectado!</b>\n\n🏷️ Cuenta: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>¡Suscripción expirada detectada!</b>\n\n🏷️ Vendedor: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n👤 Usuario: <b>{{leadName}}</b>\n📅 Expiró el: <b>{{expiresAt}}</b>\n\n🧹 El usuario fue eliminado del grupo automáticamente.",

  usd: "💵 USD (Dólar Estadounidense) {{price}}",
  eur: "💶 EUR (Euro) {{price}}",
  brl: "🇧🇷 BRL (Real Brasileño) {{price}}",
  cad: "🇨🇦 CAD (Dólar Canadiense) {{price}}",
  gbp: "💷 GBP (Libra Esterlina) {{price}}",
  aud: "🇦🇺 AUD (Dólar Australiano) {{price}}",
  jpy: "💴 JPY (Yen Japonés) {{price}}",
  krw: "🇰🇷 KRW (Won Surcoreano) {{price}}",
} as const;

/* ===================== fr-FR ===================== */
export const frFR = {
  invalidSession: "Session invalide.",
  sessionNotFound: "Session introuvable.",
  noSessionsFound: "Aucune session trouvée.",
  sessionFound: "Session trouvée.",
  sessionsFound: "{{count}} sessions trouvées.",

  noInactivatedSessions: "Aucune session trouvée.",
  inactivatedSession: "Déconnexion effectuée avec succès.",
  inactivatedSessions: "{{count}} sessions désactivées avec succès.",

  inactiveSession: "Session inactive.",

  noBlockedSession: "Aucune session bloquée.",
  blockSession: "Session bloquée avec succès.",
  blockSessions: "{{count}} sessions bloquées avec succès.",
  blockedSession: "Session inactive.",

  logoutSession: "Déconnexion réussie.",

  noUnauthorizedIp: "Aucune autorisation révoquée.",
  unauthorizedIp: "Autorisation de l’adresse IP révoquée.",
  unauthorizedIps:
    "Les autorisations de {{count}} adresses IP ont été révoquées.",
  ipNotFound: "Adresse IP introuvable.",

  userNotFound: "Utilisateur introuvable.",
  noUsersFound: "Aucun utilisateur trouvé.",
  userFound: "Utilisateur trouvé.",
  usersFound: "{{count}} utilisateurs trouvés.",

  newUserCreated: "Nouvel utilisateur créé avec succès.",

  emailVerified: "E-mail vérifié avec succès.",
  emailNotVerified: "E-mail non vérifié.",
  needEmail2fa: "Vérifiez votre e-mail pour continuer.",

  waitToResendEmail: "Veuillez patienter avant de renvoyer l’e-mail.",

  successAuthentication: "Authentification réussie.",
  successPreAuthentication: "Pré-authentification réussie.",
  failAuthentication: "Échec de l’authentification.",
  wrongPassword: "Mot de passe incorrect.",

  unauthorized: "Non autorisé.",
  attemptLimit: "Connectez-vous par e-mail.",
  requirePrivilege: "Nécessite des privilèges : {{privilege}}.",
  ownerSupportOrAdmin: "Propriétaire, support ou administrateur.",

  obrigatoryHeaders: "En-têtes HTTP invalides.",
  obrigatoryParams: "Paramètres requis manquants.",

  invalidParams: "Paramètres invalides.",
  invalidQuery: "Requête invalide.",
  invalidEmail: "E-mail invalide.",
  invalidPhone: "Numéro de téléphone invalide.",
  invalidPassword: "Mot de passe invalide.",
  emailInUse: "E-mail déjà utilisé.",
  phoneInUse: "Numéro de téléphone déjà utilisé.",
  invalidHeaders: "En-têtes HTTP invalides.",
  easyPassword: "Mot de passe faible.",

  sendedEmail: "E-mail envoyé avec succès.",
  emailAlreadyVerified: "E-mail déjà vérifié.",
  needVerifyEmail: "Vérifiez votre e-mail.",

  invalidToken: "Jeton invalide.",

  invalidRefreshToken: "Jeton d’actualisation invalide.",

  cantDecodeToken: "Impossible de décoder le jeton.",
  invalidTokenType: "Type de jeton invalide, attendu : {{type}}.",

  unauthorizedSession:
    "La session n’est pas authentifiée. Veuillez vous reconnecter.",

  cantDecodeRefreshToken: "Impossible de décoder le jeton.",
  invalidRefreshTokenType: "Type de jeton invalide, attendu : {{type}}.",

  invalidTokenPayload: "Charge utile du jeton invalide, il manque : {{lost}}",

  verificationTokenNotFound: "Jeton de vérification introuvable.",

  invalidVerificationToken:
    "Jeton de vérification invalide. Renvoyez l’e-mail et réessayez.",
  cantDecodeVerificationToken: "Impossible de décoder le jeton.",
  invalidVerificationTokenType:
    "Type de jeton de vérification invalide, attendu : {{type}}.",

  joinGroup: "Cliquez sur le lien ci-dessous pour rejoindre le groupe VIP.",
  joinGroupCTA: "Rejoindre le groupe ➡️",
  retryStart: "Acheter à nouveau ⬅️",

  telegramSellerNotification:
    "💸 <b>Vente confirmée !</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>Erreur détectée !</b>\n\n🏷️ Compte : <b>{{account}}</b>\n🤖 ID du bot : <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>Abonnement expiré détecté !</b>\n\n🏷️ Vendeur : <b>{{account}}</b>\n🤖 ID du bot : <b>{{botId}}</b>\n👤 Nom d’utilisateur : <b>{{leadName}}</b>\n📅 Expiré le : <b>{{expiresAt}}</b>\n\n🧹 L’utilisateur a été supprimé automatiquement du groupe.",

  usd: "💵 USD (Dollar Américain) {{price}}",
  eur: "💶 EUR (Euro) {{price}}",
  brl: "🇧🇷 BRL (Réal Brésilien) {{price}}",
  cad: "🇨🇦 CAD (Dollar Canadien) {{price}}",
  gbp: "💷 GBP (Livre Sterling) {{price}}",
  aud: "🇦🇺 AUD (Dollar Australien) {{price}}",
  jpy: "💴 JPY (Yen Japonais) {{price}}",
  krw: "🇰🇷 KRW (Won Sud-Coréen) {{price}}",
} as const;

/* ===================== it-IT ===================== */
export const itIT = {
  invalidSession: "Sessione non valida.",
  sessionNotFound: "Sessione non trovata.",
  noSessionsFound: "Nessuna sessione trovata.",
  sessionFound: "Sessione trovata.",
  sessionsFound: "{{count}} sessioni trovate.",

  noInactivatedSessions: "Nessuna sessione trovata.",
  inactivatedSession: "Logout eseguito con successo.",
  inactivatedSessions: "{{count}} sessioni disattivate con successo.",

  inactiveSession: "Sessione inattiva.",

  noBlockedSession: "Nessuna sessione bloccata.",
  blockSession: "Sessione bloccata con successo.",
  blockSessions: "{{count}} sessioni bloccate con successo.",
  blockedSession: "Sessione inattiva.",

  logoutSession: "Logout eseguito con successo.",

  noUnauthorizedIp: "Nessuna autorizzazione revocata.",
  unauthorizedIp: "Autorizzazione dell’indirizzo IP revocata.",
  unauthorizedIps: "Autorizzazioni revocate per {{count}} indirizzi IP.",
  ipNotFound: "Indirizzo IP non trovato.",

  userNotFound: "Utente non trovato.",
  noUsersFound: "Nessun utente trovato.",
  userFound: "Utente trovato.",
  usersFound: "{{count}} utenti trovati.",

  newUserCreated: "Nuovo utente creato con successo.",

  emailVerified: "E-mail verificata con successo.",
  emailNotVerified: "E-mail non verificata.",
  needEmail2fa: "Controlla l’e-mail per continuare.",

  waitToResendEmail: "Attendi prima di reinviare l’e-mail.",

  successAuthentication: "Autenticazione riuscita.",
  successPreAuthentication: "Pre-autenticazione riuscita.",
  failAuthentication: "Autenticazione non riuscita.",
  wrongPassword: "Password errata.",

  unauthorized: "Non autorizzato.",
  attemptLimit: "Accedi tramite e-mail.",
  requirePrivilege: "Richiede privilegi: {{privilege}}.",
  ownerSupportOrAdmin: "Proprietario, supporto o amministratore.",

  obrigatoryHeaders: "Intestazioni HTTP non valide.",
  obrigatoryParams: "Parametri obbligatori mancanti.",

  invalidParams: "Parametri non validi.",
  invalidQuery: "Query non valida.",
  invalidEmail: "E-mail non valida.",
  invalidPhone: "Numero di telefono non valido.",
  invalidPassword: "Password non valida.",
  emailInUse: "E-mail già in uso.",
  phoneInUse: "Numero di telefono già in uso.",
  invalidHeaders: "Intestazioni HTTP non valide.",
  easyPassword: "Password debole.",

  sendedEmail: "E-mail inviata con successo.",
  emailAlreadyVerified: "E-mail già verificata.",
  needVerifyEmail: "Verifica la tua e-mail.",

  invalidToken: "Token non valido.",

  invalidRefreshToken: "Refresh token non valido.",

  cantDecodeToken: "Impossibile decodificare il token.",
  invalidTokenType: "Tipo di token non valido, richiesto: {{type}}.",

  unauthorizedSession:
    "La sessione non è autenticata. Effettua nuovamente l’accesso.",

  cantDecodeRefreshToken: "Impossibile decodificare il token.",
  invalidRefreshTokenType: "Tipo di token non valido, richiesto: {{type}}.",

  invalidTokenPayload: "Payload del token non valido, mancante: {{lost}}",

  verificationTokenNotFound: "Token di verifica non trovato.",

  invalidVerificationToken:
    "Token di verifica non valido. Reinvia l’e-mail e riprova.",
  cantDecodeVerificationToken: "Impossibile decodificare il token.",
  invalidVerificationTokenType:
    "Tipo di token di verifica non valido, richiesto: {{type}}.",

  joinGroup: "Clicca sul link qui sotto per entrare nel gruppo VIP.",
  joinGroupCTA: "Entra nel gruppo ➡️",
  retryStart: "Acquista di nuovo ⬅️",

  telegramSellerNotification:
    "💸 <b>Vendita confermata!</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>Errore rilevato!</b>\n\n🏷️ Account: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>Abbonamento scaduto rilevato!</b>\n\n🏷️ Venditore: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n👤 Username: <b>{{leadName}}</b>\n📅 Scaduto il: <b>{{expiresAt}}</b>\n\n🧹 L’utente è stato rimosso automaticamente dal gruppo.",

  usd: "💵 USD (Dollaro Statunitense) {{price}}",
  eur: "💶 EUR (Euro) {{price}}",
  brl: "🇧🇷 BRL (Real Brasiliano) {{price}}",
  cad: "🇨🇦 CAD (Dollaro Canadese) {{price}}",
  gbp: "💷 GBP (Sterlina Inglese) {{price}}",
  aud: "🇦🇺 AUD (Dollaro Australiano) {{price}}",
  jpy: "💴 JPY (Yen Giapponese) {{price}}",
  krw: "🇰🇷 KRW (Won Sudcoreano) {{price}}",
} as const;

/* ===================== ja-JP ===================== */
export const jaJP = {
  invalidSession: "無効なセッションです。",
  sessionNotFound: "セッションが見つかりません。",
  noSessionsFound: "セッションは見つかりませんでした。",
  sessionFound: "セッションが見つかりました。",
  sessionsFound: "{{count}} 件のセッションが見つかりました。",

  noInactivatedSessions: "セッションは見つかりませんでした。",
  inactivatedSession: "ログアウトに成功しました。",
  inactivatedSessions: "{{count}} 件のセッションを無効化しました。",

  inactiveSession: "セッションが無効です。",

  noBlockedSession: "ブロックされたセッションはありません。",
  blockSession: "セッションをブロックしました。",
  blockSessions: "{{count}} 件のセッションをブロックしました。",
  blockedSession: "セッションが無効です。",

  logoutSession: "ログアウトに成功しました。",

  noUnauthorizedIp: "取り消された許可はありません。",
  unauthorizedIp: "IPアドレスの許可を取り消しました。",
  unauthorizedIps: "{{count}} 件のIPアドレスの許可を取り消しました。",
  ipNotFound: "IPアドレスが見つかりません。",

  userNotFound: "ユーザーが見つかりません。",
  noUsersFound: "ユーザーは見つかりませんでした。",
  userFound: "ユーザーが見つかりました。",
  usersFound: "{{count}} 人のユーザーが見つかりました。",

  newUserCreated: "新規ユーザーを作成しました。",

  emailVerified: "メールの確認が完了しました。",
  emailNotVerified: "メールが確認されていません。",
  needEmail2fa: "続行するにはメールを確認してください。",

  waitToResendEmail: "メール再送までお待ちください。",

  successAuthentication: "認証に成功しました。",
  successPreAuthentication: "事前認証に成功しました。",
  failAuthentication: "認証に失敗しました。",
  wrongPassword: "パスワードが正しくありません。",

  unauthorized: "認可されていません。",
  attemptLimit: "メールでログインしてください。",
  requirePrivilege: "必要な権限: {{privilege}}。",
  ownerSupportOrAdmin: "所有者、サポート、または管理者。",

  obrigatoryHeaders: "無効なHTTPヘッダーです。",
  obrigatoryParams: "必須パラメーターが不足しています。",

  invalidParams: "無効なパラメーターです。",
  invalidQuery: "無効なクエリです。",
  invalidEmail: "無効なメールアドレスです。",
  invalidPhone: "無効な電話番号です。",
  invalidPassword: "無効なパスワードです。",
  emailInUse: "メールアドレスは既に使用されています。",
  phoneInUse: "電話番号は既に使用されています。",
  invalidHeaders: "無効なHTTPヘッダーです。",
  easyPassword: "パスワードが弱すぎます。",

  sendedEmail: "メールを送信しました。",
  emailAlreadyVerified: "メールは既に確認済みです。",
  needVerifyEmail: "メールを確認してください。",

  invalidToken: "無効なトークンです。",

  invalidRefreshToken: "無効なリフレッシュトークンです。",

  cantDecodeToken: "トークンをデコードできませんでした。",
  invalidTokenType: "無効なトークンタイプです。必要: {{type}}。",

  unauthorizedSession:
    "セッションが認証されていません。もう一度ログインしてください。",

  cantDecodeRefreshToken: "トークンをデコードできませんでした。",
  invalidRefreshTokenType: "無効なトークンタイプです。必要: {{type}}。",

  invalidTokenPayload: "無効なトークンのペイロードです。欠落: {{lost}}",

  verificationTokenNotFound: "検証用トークンが見つかりません。",

  invalidVerificationToken:
    "無効な検証トークンです。メールを再送してもう一度お試しください。",
  cantDecodeVerificationToken: "トークンをデコードできませんでした。",
  invalidVerificationTokenType:
    "無効な検証トークンタイプです。必要: {{type}}。",

  joinGroup: "VIPグループに参加するには、以下のリンクをタップしてください。",
  joinGroupCTA: "グループに参加 ➡️",
  retryStart: "もう一度購入 ⬅️",

  telegramSellerNotification:
    "💸 <b>販売が確定しました！</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>エラーを検出しました！</b>\n\n🏷️ アカウント: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>期限切れのサブスクリプションを検出！</b>\n\n🏷️ セラー: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n👤 ユーザー名: <b>{{leadName}}</b>\n📅 期限: <b>{{expiresAt}}</b>\n\n🧹 ユーザーは自動的にグループから削除されました。",

  usd: "💵 USD（米ドル）{{price}}",
  eur: "💶 EUR（ユーロ）{{price}}",
  brl: "🇧🇷 BRL（ブラジルレアル）{{price}}",
  cad: "🇨🇦 CAD（カナダドル）{{price}}",
  gbp: "💷 GBP（英ポンド）{{price}}",
  aud: "🇦🇺 AUD（オーストラリアドル）{{price}}",
  jpy: "💴 JPY（日本円）{{price}}",
  krw: "🇰🇷 KRW（韓国ウォン）{{price}}",
} as const;

/* ===================== ko-KR ===================== */
export const koKR = {
  invalidSession: "유효하지 않은 세션입니다.",
  sessionNotFound: "세션을 찾을 수 없습니다.",
  noSessionsFound: "세션이 없습니다.",
  sessionFound: "세션을 찾았습니다.",
  sessionsFound: "{{count}}개의 세션이 발견되었습니다.",

  noInactivatedSessions: "세션이 없습니다.",
  inactivatedSession: "로그아웃이 완료되었습니다.",
  inactivatedSessions: "{{count}}개의 세션이 비활성화되었습니다.",

  inactiveSession: "비활성 세션입니다.",

  noBlockedSession: "차단된 세션이 없습니다.",
  blockSession: "세션을 성공적으로 차단했습니다.",
  blockSessions: "{{count}}개의 세션을 성공적으로 차단했습니다.",
  blockedSession: "비활성 세션입니다.",

  logoutSession: "로그아웃이 완료되었습니다.",

  noUnauthorizedIp: "철회된 권한이 없습니다.",
  unauthorizedIp: "IP 주소 권한이 철회되었습니다.",
  unauthorizedIps: "{{count}}개의 IP 주소에서 권한이 철회되었습니다.",
  ipNotFound: "IP 주소를 찾을 수 없습니다.",

  userNotFound: "사용자를 찾을 수 없습니다.",
  noUsersFound: "사용자가 없습니다.",
  userFound: "사용자를 찾았습니다.",
  usersFound: "{{count}}명의 사용자가 발견되었습니다.",

  newUserCreated: "새 사용자가 성공적으로 생성되었습니다.",

  emailVerified: "이메일이 성공적으로 인증되었습니다.",
  emailNotVerified: "이메일이 인증되지 않았습니다.",
  needEmail2fa: "계속하려면 이메일을 확인하세요.",

  waitToResendEmail: "이메일 재전송까지 잠시 기다려 주세요.",

  successAuthentication: "인증에 성공했습니다.",
  successPreAuthentication: "사전 인증에 성공했습니다.",
  failAuthentication: "인증에 실패했습니다.",
  wrongPassword: "비밀번호가 올바르지 않습니다.",

  unauthorized: "권한이 없습니다.",
  attemptLimit: "이메일로 로그인하세요.",
  requirePrivilege: "필요 권한: {{privilege}}.",
  ownerSupportOrAdmin: "소유자, 지원 또는 관리자.",

  obrigatoryHeaders: "유효하지 않은 HTTP 헤더입니다.",
  obrigatoryParams: "필수 매개변수가 누락되었습니다.",

  invalidParams: "유효하지 않은 매개변수입니다.",
  invalidQuery: "유효하지 않은 쿼리입니다.",
  invalidEmail: "유효하지 않은 이메일입니다.",
  invalidPhone: "유효하지 않은 휴대폰 번호입니다.",
  invalidPassword: "유효하지 않은 비밀번호입니다.",
  emailInUse: "이미 사용 중인 이메일입니다.",
  phoneInUse: "이미 사용 중인 휴대폰 번호입니다.",
  invalidHeaders: "유효하지 않은 HTTP 헤더입니다.",
  easyPassword: "취약한 비밀번호입니다.",

  sendedEmail: "이메일이 성공적으로 전송되었습니다.",
  emailAlreadyVerified: "이메일이 이미 인증되었습니다.",
  needVerifyEmail: "이메일을 확인하세요.",

  invalidToken: "유효하지 않은 토큰입니다.",

  invalidRefreshToken: "유효하지 않은 리프레시 토큰입니다.",

  cantDecodeToken: "토큰을 디코딩할 수 없습니다.",
  invalidTokenType: "유효하지 않은 토큰 유형입니다. 필요: {{type}}.",

  unauthorizedSession: "세션이 인증되지 않았습니다. 다시 로그인하세요.",

  cantDecodeRefreshToken: "토큰을 디코딩할 수 없습니다.",
  invalidRefreshTokenType: "유효하지 않은 토큰 유형입니다. 필요: {{type}}.",

  invalidTokenPayload: "유효하지 않은 토큰 페이로드입니다. 누락: {{lost}}",

  verificationTokenNotFound: "검증 토큰을 찾을 수 없습니다.",

  invalidVerificationToken:
    "유효하지 않은 검증 토큰입니다. 이메일을 다시 보내고 다시 시도하세요.",
  cantDecodeVerificationToken: "토큰을 디코딩할 수 없습니다.",
  invalidVerificationTokenType:
    "유효하지 않은 검증 토큰 유형입니다. 필요: {{type}}.",

  joinGroup: "아래 링크를 클릭하여 VIP 그룹에 참여하세요.",
  joinGroupCTA: "그룹 참여 ➡️",
  retryStart: "다시 구매 ⬅️",

  telegramSellerNotification:
    "💸 <b>판매 확정!</b>\n\n⏰ {{time}}\n💰 {{price}}\n🌐 {{email}}\n 🏷️ {{account}}",

  telegramErrorNotification:
    "❌ <b>오류가 감지되었습니다!</b>\n\n🏷️ 계정: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n\n<pre>{{error}}</pre>",

  telegramChurnNotification:
    "⚠️ <b>만료된 구독이 감지되었습니다!</b>\n\n🏷️ 판매자: <b>{{account}}</b>\n🤖 Bot ID: <b>{{botId}}</b>\n👤 사용자명: <b>{{leadName}}</b>\n📅 만료일: <b>{{expiresAt}}</b>\n\n🧹 사용자는 자동으로 그룹에서 제거되었습니다.",

  usd: "💵 USD (미국 달러) {{price}}",
  eur: "💶 EUR (유로) {{price}}",
  brl: "🇧🇷 BRL (브라질 레알) {{price}}",
  cad: "🇨🇦 CAD (캐나다 달러) {{price}}",
  gbp: "💷 GBP (영국 파운드) {{price}}",
  aud: "🇦🇺 AUD (호주 달러) {{price}}",
  jpy: "💴 JPY (일본 엔) {{price}}",
  krw: "🇰🇷 KRW (대한민국 원) {{price}}",
} as const;

/* ===== Bundle opcional: exporte tudo junto se quiser ===== */
const locales = {
  "pt-BR": ptBR,
  en: enUS,
  "en-GB": enGB,
  de: deDE,
  es: esES,
  fr: frFR,
  it: itIT,
  ja: jaJP,
  ko: koKR,
} as const;

export default locales;
