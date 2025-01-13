import JSON from "JSON";

function loadStorage() {
  const Session = {
    user:
      sessionStorage.getItem("@Auth:user") &&
      JSON.parse(sessionStorage.getItem("@Auth:user")),
    token: sessionStorage.getItem("@Auth:token"),
    refreshToken: sessionStorage.getItem("@Auth:refresh-token"),
    nextStep: sessionStorage.getItem("@Auth:next-step"),
  };
  const Local = {
    user:
      localStorage.getItem("@Auth:user") &&
      JSON.parse(localStorage.getItem("@Auth:user")),
    token: localStorage.getItem("@Auth:token"),
    refreshToken: localStorage.getItem("@Auth:refresh-token"),
    nextStep: localStorage.getItem("@Auth:next-step"),
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
    Local.remember = false;
    return Session;
  }

  return false;
}

export default loadStorage;
