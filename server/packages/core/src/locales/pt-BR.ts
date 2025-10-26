const ptBR = {
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

  eur: "💶 EUR (Euro) {{price}}",
  usd: "💵 USD (Dólar) {{price}}",
  brl: "🇧🇷 BRL (Real) {{price}}",
} as const;

export default ptBR;
