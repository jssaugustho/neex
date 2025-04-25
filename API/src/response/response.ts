class Response {
  //quando o campo é inválido
  invalidParam(param) {
    return "Campo inválido: " + param;
  }
  //parametro obrigatório
  obrigatoryParam(param) {
    return "Preencha todos os campos obrigatórios.";
  }
  //email em uso
  emailInUse() {
    return "Email indisponível.";
  }
  //tamanho da senha inválido
  invalidPasswdLength(min, max) {
    return "A senha deve ter entre " + min + " e " + max + " caracteres.";
  }
  //senhas não combinam
  notMatchPasswd() {
    return "As senhas não combinam.";
  }
  //aguarde para enviar código de verificação novamente.
  waitVerificationCode() {
    return "Aguarde o prazo para reenviar.";
  }
  succesAuth() {
    return "Autenticado com sucesso.";
  }
  needAuth() {
    return "Necessita de autenticação.";
  }
  authError() {
    return "Erro na autenticação.";
  }
  expiredToken() {
    return "Token expirado.";
  }
  invalidToken() {
    return "Token invállido.";
  }
  invalidRefreshToken() {
    return "Refresh Token invállido.";
  }
  unauthorizated() {
    return "Não autorizado.";
  }
  emailNotExists() {
    return "Usuário não encontrado.";
  }
  incorrectPasswd() {
    return "Senha incorreta.";
  }
  succesUserUpdate() {
    return "Usuário atualizado com sucesso.";
  }
  userFound(n) {
    if (n > 1) return n + " usuários encontrados.";
    if (n == 0) return "Nenhum usuário encontrado.";
    else return "Usuário encontrado.";
  }
  leadFound(n) {
    if (n > 1) return n + " leads encontrados.";
    if (n == 0) return "Nenhum lead encontrado.";
    else return "Lead encontrado.";
  }
  userNotFound() {
    return "Usuário não encontrado.";
  }
  verifyYourEmail() {
    return "Verifique o seu email.";
  }
  quizNotFound() {
    return "Quiz não encontrado.";
  }
  invalidType(param) {
    if (typeof param == "object" && param.length > 1)
      return "Tipo dos campos inválidos: " + param.join(", ");
    else return "Campo inválido: " + param;
  }
  requiresOne() {
    return "Requer pelo menos um campo.";
  }
  invalidOption(p) {
    return "Opção inválida: " + p;
  }
  leadNotFound() {
    return "Lead não encontrado.";
  }
  succesLeadUpdate() {
    return "Lead atualizado com sucesso.";
  }
  succesLeadDelete() {
    return "Lead excluído com sucesso.";
  }
  notAgree() {
    return "Você deve concordar com os termos e condições.";
  }
  jwtRefreshKeyUndefined() {
    return "JWT_REFRESH_SECRET undefined.";
  }
  blockedUserAgent() {
    return "SVocê não tem autorização para acessar essa API.";
  }
  needFingerprintHeader() {
    return "Você não tem autorização para acessar essa API.";
  }
  invalidSession() {
    return "Sessão inválida.";
  }
  needVerifyEmail() {
    return "Necessário verificar seu email.";
  }
  cannotSendEmail() {
    return "Não foi possível enviar o email.";
  }
  sessionNotFound() {
    return "Sessão não encontrada.";
  }
  invalidFingerprint() {
    return "ID do Dispositivo inválido.";
  }
  emailAvaible() {
    return "Email disponível.";
  }
  needOneQueryParam() {
    return "Requer pelo menos um parametro na query.";
  }
  needOneBodyParam() {
    return "Requer pelo menos um parametro para editar.";
  }
  invalidUpdate() {
    return "Não foi possível atualizar usuário.";
  }
  cantVerifyEmail() {
    return "Não foi possível verificar o email.";
  }
  retryAuthentication() {
    return "Faça login novamente.";
  }
  emailVerified() {
    return "Email verificado.";
  }
  sessionsFound(num: number) {
    let response = "Nenhuma sessão encontrada.";

    if (num === 1) response = "Sessão encontrada.";

    if (num > 1) response = `${num} sessões encontradas.`;

    return response;
  }
  sessionsInactived(num: number) {
    let response = "Nenhuma sessão encontrada.";

    if (num === 1) response = "Logout realizado na sessão.";

    if (num > 1) response = `Logout realizado em ${num} sessões.`;

    return response;
  }
  sessionsUnauthorized(num: number) {
    let response = "Nenhuma sessão encontrada.";

    if (num === 1) response = "Autorização revogada na sessão.";

    if (num > 1) response = `${num} autorizações revogadas.`;

    return response;
  }
  attemptLimit() {
    return "Limite de tentativas excedido.";
  }
  sessionInactive() {
    return "Sessão já inativa.";
  }
  invalidEmailToken() {
    return "Token de email inválido.";
  }
  invalidQuery() {
    return "Query invalida.";
  }
  phoneInUse() {
    return "Número de celular indisponível.";
  }
}

export default new Response();
