import { useQuery } from "react-query";

import useAuth from "../../hooks/useAuth/useAuth.jsx";
import loadStorage from "../../utils/loadStorage/loadStorage.js";

export default function useUser() {
  const { api, setUser, signed, setNextStep } = useAuth();

  async function fetchUser() {
    const response = await api.get("/user");

    return response.data.data;
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
    onError: (error) => {
      console.error("Error fetching user data:", error);
      // Handle error appropriately, e.g., redirect to login or show an error message
    },

    enabled: signed,
    refetchOnWindowFocus: true,
    retry: 5,
    refetchInterval: 1000 * 60,
  });
}
