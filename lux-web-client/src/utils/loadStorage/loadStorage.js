import JSON from "JSON";

function loadStorage() {
  const Session = {
    user:
      sessionStorage.getItem("@Auth:user") &&
      JSON.parse(sessionStorage.getItem("@Auth:user")),
    token: sessionStorage.getItem("@Auth:token"),
    refreshToken: sessionStorage.getItem("@Auth:refresh-token"),
    nextStep: sessionStorage.getItem("@Auth:next-step"),
    sessionId: sessionStorage.getItem("@Auth:session") || "",
    locale: sessionStorage.getItem("@Auth:locale") || "pt-BR",
    timeZone: sessionStorage.getItem("@Auth:timezone") || "America/Sao_Paulo",
  };
  const Local = {
    user:
      localStorage.getItem("@Auth:user") &&
      JSON.parse(localStorage.getItem("@Auth:user")),
    token: localStorage.getItem("@Auth:token"),
    refreshToken: localStorage.getItem("@Auth:refresh-token"),
    nextStep: localStorage.getItem("@Auth:next-step"),
    sessionId: localStorage.getItem("@Auth:session") || "",
    locale: localStorage.getItem("@Auth:locale") || "pt-BR",
    timeZone: localStorage.getItem("@Auth:timezone") || "America/Sao_Paulo",
  };

  if (Local.user && Local.token && Local.refreshToken && Local.nextStep) {
    Local.remember = true;
    return Local;
  }

  if (
    Session.user &&
    Session.token &&
    Session.refreshToken &&
    Session.nextStep
  ) {
    Session.remember = false;
    return Session;
  }

  return false;
}

export default loadStorage;
