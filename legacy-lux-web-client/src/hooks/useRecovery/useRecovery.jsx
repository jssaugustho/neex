import { useMutation, useQueryClient } from "react-query";
import useAuth from "../useAuth/useAuth";

function useRecovery() {
  const { api, setUser, setSigned, setNextStep } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api
        .post("/verify-recovery-code", data)
        .then((r) => r.data);

      console.log(response);

      sessionStorage.setItem("@Auth:token", response.token);
      sessionStorage.setItem("@Auth:refresh-token", response.refreshToken);
      sessionStorage.setItem("@Auth:user", JSON.stringify(response.data));
      sessionStorage.setItem(
        "@Auth:next-step",
        response.data.emailVerified ? "/dashboard" : "/verify"
      );

      return response;
    },
    onSuccess: async (data) => {
      api.defaults.headers.common["Authorization"] = data.token;

      setUser(data.data);
      setSigned(true);
      setNextStep(data.data.emailVerified ? "/dashboard" : "/verify");

      queryClient.invalidateQueries(["user"]);
    },
    retry: false,
  });
}

export default useRecovery;
