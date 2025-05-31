import { useQuery } from "react-query";

import useAuth from "../../hooks/useAuth/useAuth.jsx";
import loadStorage from "../../utils/loadStorage/loadStorage.js";

function useUser() {
  const { api, setUser, signed, setNextStep } = useAuth();

  async function fetchUser() {
    const response = await api
      .get("/user")
      .then((response) => response.data.data[0]);

    return response;
  }

  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    onSuccess: (data) => {
      const storage = loadStorage();

      if (storage.remember) {
        localStorage.setItem("@Auth:user", JSON.stringify(data));
        localStorage.setItem(
          "@Auth:next-step",
          data.emailVerified ? "/dashboard" : "/verify"
        );
      } else {
        sessionStorage.setItem("@Auth:user", JSON.stringify(data));
        sessionStorage.setItem(
          "@Auth:next-step",
          data.emailVerified ? "/dashboard" : "/verify"
        );
      }

      setUser(data);
      setNextStep(data.emailVerified ? "/dashboard" : "/verify");
    },
    enabled: signed,
    refetchOnWindowFocus: true,
    retry: 5,
    refetchInterval: 1000 * 60,
  });
}

export default useUser;
