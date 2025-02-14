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
    return "Email em uso.";
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
  unauthorizated() {
    return "Não autorizado.";
  }
  succesUserUpdate() {
    return "Usuário atualizado com sucesso.";
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
    else return "1 usuário encontrado.";
  }
  leadFound(n) {
    if (n > 1) return n + " leads encontrados.";
    if (n == 0) return "Nenhum lead encontrado.";
    else return "Lead encontrado.";
  }
  userNotFound(n) {
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
}

export default new Response();
