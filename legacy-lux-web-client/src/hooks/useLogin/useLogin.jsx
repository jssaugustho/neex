import { useMutation, useQueryClient } from "react-query";
import useAuth from "../useAuth/useAuth";

function useLogin() {
  const { api, setUser, setSigned, setNextStep } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, remember }) => {
      const response = await api.post("/login", data).then((r) => r.data);

      if (remember) {
        localStorage.setItem("@Auth:token", response.token);
        localStorage.setItem("@Auth:refresh-token", response.refreshToken);
        localStorage.setItem("@Auth:user", JSON.stringify(response.data));
        localStorage.setItem(
          "@Auth:next-step",
          response.data.emailVerified ? "/dashboard" : "/verify"
        );
        response.data.session &&
          localStorage.setItem("@Auth:session", response.data.session);
      } else {
        sessionStorage.setItem("@Auth:token", response.token);
        sessionStorage.setItem("@Auth:refresh-token", response.refreshToken);
        sessionStorage.setItem("@Auth:user", JSON.stringify(response.data));
        sessionStorage.setItem(
          "@Auth:next-step",
          response.data.emailVerified ? "/dashboard" : "/verify"
        );
        response.data.session &&
          sessionStorage.setItem("@Auth:session", response.data.session);
      }

      return response;
    },
    onSuccess: async (data) => {
      api.defaults.headers.common["Authorization"] = data.token;

      setUser(data.data);
      setSigned(true);
      setNextStep("/dashboard");

      queryClient.invalidateQueries(["user"]);
    },
    retry: false,
  });
}

export default useLogin;
