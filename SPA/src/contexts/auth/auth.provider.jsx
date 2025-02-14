import { useEffect, useState } from "react";

import AuthContext from "../auth/auth.context.jsx";
import loadStorage from "../../utils/loadStorage/loadStorage.js";

import initApi from "../../services/api.jsx";
import { useQueryClient } from "react-query";

function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [signed, setSigned] = useState(false);
  const [nextStep, setNextStep] = useState("/dashboard");

  const [firstTime, setFirstTime] = useState(false);

  const [toggleNavBar, setToggleNavBar] = useState(false);

  const api = initApi(signOut, loadStorage(), signed);

  const queryClient = useQueryClient();

  // load storage
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

  function signOut() {
    delete api.defaults.headers.common["Authorization"];
    queryClient.removeQueries();
    queryClient.cancelQueries();
    sessionStorage.clear();
    localStorage.clear();
    setSigned(false);
    setUser({});
    setNextStep(null);
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
        signOut,
        toggleNavBar,
        setToggleNavBar,
        firstTime,
        setFirstTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
