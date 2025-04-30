import { useMutation, useQueryClient } from "react-query";
import useAuth from "../useAuth/useAuth";

function useRegister() {
  const { api, setUser, setSigned, setNextStep, setFirstTime } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/user", data).then((r) => r.data);

      return response;
    },
    onSuccess: (data) => {
      api.defaults.headers.common["Authorization"] = data.token;

      sessionStorage.setItem("@Auth:token", data.token);
      sessionStorage.setItem("@Auth:refresh-token", data.refreshToken);
      sessionStorage.setItem("@Auth:user", JSON.stringify(data.data));
      sessionStorage.setItem(
        "@Auth:next-step",
        data.data.emailVerified ? "/dashboard" : "/verify"
      );
      setFirstTime(true);
      setUser(data.data);
      setNextStep(data.data.emailVerified ? "/dashboard" : "/verify");
      setSigned(true);

      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => {
      console.log(err);
    },
  });
}

export default useRegister;
