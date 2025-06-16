import { useEffect, useState } from "react";

import AuthContext from "../auth/auth.context.jsx";
import loadStorage from "../../utils/loadStorage/loadStorage.js";

import initApi from "../../services/api.jsx";
import useSignout from "../../hooks/useSignOut/useSignout.jsx";

function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [signed, setSigned] = useState(false);
  const [nextStep, setNextStep] = useState("/dashboard");

  const [firstTime, setFirstTime] = useState(false);

  const [toggleNavBar, setToggleNavBar] = useState(false);

  const api = initApi(signOut, loadStorage(), signed);

  const { mutateAsync: signOutMutate } = useSignout();

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

  async function signOut() {
    const data = await signOutMutate();

    return data;
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
