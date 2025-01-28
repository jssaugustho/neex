import { useEffect, useState } from "react";
import AuthContext from "./auth.context.jsx";
import loadStorage from "../../utils/loadStorage/loadStorage.js";
import initApi from "../../services/api.jsx";

function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [signed, setSigned] = useState(false);
  const [nextStep, setNextStep] = useState("/dashboard");

  const [toggleNavBar, setToggleNavBar] = useState(false);

  const api = initApi(signOut);

  async function post(route, data) {
    try {
      const restult = await api.post(route, data);

      return restult;
    } catch (e) {
      return e.response;
    }
  }

  async function get(route) {
    try {
      const restult = await api.get(route);

      return restult;
    } catch (e) {
      return e.response;
    }
  }

  useEffect(() => {
    if (signed) {
      get("/user").then((r) => {
        const storage = loadStorage();

        const updatedUser = JSON.stringify(r.data.data[0]);

        if (storage.remember) localStorage.setItem("@Auth:user", updatedUser);
        else sessionStorage.setItem("@Auth:user", updatedUser);

        setNextStep(updatedUser.emailVerified ? "/dashboard" : "/verify");
        setUser(updatedUser);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const storage = loadStorage();

    if (storage) {
      api.defaults.headers.common["Authorization"] = storage.token;

      setUser(storage.user);
      setNextStep(storage.nextStep);
      setSigned(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(email, passwd, remember, msg) {
    if (passwd.length < 8 || email.length < 8) {
      msg("Campos inválidos.", "error");
      return;
    }

    let data = {};

    if (email != "") data.email = email;
    if (passwd != "") data.passwd = passwd;

    const response = await post("/login", data);

    if (response.status == 200) {
      const { data } = response;

      const userDataString = JSON.stringify(data.data);

      if (remember) {
        localStorage.setItem("@Auth:token", data.token);
        localStorage.setItem("@Auth:refresh-token", data.refreshToken);
        localStorage.setItem("@Auth:user", userDataString);
        localStorage.setItem(
          "@Auth:next-step",
          data.data.emailVerified ? "/dashboard" : "/verify"
        );
      } else {
        sessionStorage.setItem("@Auth:token", data.token);
        sessionStorage.setItem("@Auth:refresh-token", data.refreshToken);
        sessionStorage.setItem("@Auth:user", userDataString);
        sessionStorage.setItem(
          "@Auth:next-step",
          data.data.emailVerified ? "/dashboard" : "/verify"
        );
      }

      api.defaults.headers.common["Authorization"] = data.token;

      setUser(data.data);
      setNextStep(data.data.emailVerified ? "/dashboard" : "/verify");
      setSigned(true);
    } else {
      const { data } = response;
      msg(data.message, "error");
    }
  }

  async function signUp(userData, msg) {
    async function post(route, data) {
      try {
        const restult = await api.post(route, data);
        return restult;
      } catch (e) {
        return e.response;
      }
    }

    const response = await post("/user", userData);
    console.log(response);

    if (response.status == 200) {
      const { data } = response;
      const userDataString = JSON.stringify(data.data);

      localStorage.setItem("@Auth:token", data.token);
      localStorage.setItem("@Auth:refresh-token", data.refreshToken);
      localStorage.setItem("@Auth:user", userDataString);
      localStorage.setItem("@Auth:next-step", "/verify");

      //set api default token
      api.defaults.headers.common["Authorization"] = data.token;

      //set user logged in
      setUser(data.data);
      setNextStep("/verify");
      setSigned(true);
    } else {
      const { data } = response;
      msg(data.message, "error");
    }
    return;
  }

  function signOut() {
    sessionStorage.clear();
    localStorage.clear();
    setUser({});
    setSigned(false);
  }

  return (
    <AuthContext.Provider
      value={{
        api,
        user,
        setUser,
        signed,
        setSigned,
        nextStep,
        setNextStep,
        signIn,
        signUp,
        signOut,
        toggleNavBar,
        setToggleNavBar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
