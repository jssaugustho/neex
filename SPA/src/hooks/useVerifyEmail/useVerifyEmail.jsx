import { useMutation, useQueryClient } from "react-query";
import useAuth from "../useAuth/useAuth";

function useVerifyEmail() {
  const { api, setNextStep } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/verify", data).then((r) => r.data);

      return response;
    },
    onSuccess: () => {
      localStorage.setItem("@Auth:next-step", "/dashboard");
      setNextStep("/dashboard");
      queryClient.invalidateQueries(["user"]);
    },
  });
}

export default useVerifyEmail;
