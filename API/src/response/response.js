class Response {
  //quando o campo é inválido
  invalidParam(param) {
    return "Campo inválido: " + param;
  }
  //parametro obrigatório
  obrigatoryParam(param) {
    if (typeof param == "object" && param.length > 1)
      return "Campos obrigatórios: " + param.join(", ");
    else return "Campo obrigatório: " + param;
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
    return "Aguarde 1 minuto e tente enviar o código novamente.";
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
    return "Email não existe.";
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
  userNotFound(n) {
    return "Usuário não encontrado.";
  }
}

export default new Response();
