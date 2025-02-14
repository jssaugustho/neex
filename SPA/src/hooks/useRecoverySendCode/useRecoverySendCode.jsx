import { useMutation } from "react-query";
import useAuth from "../useAuth/useAuth";

function useRecoverySendCode() {
  const { api } = useAuth();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/recovery", data).then((r) => r.data);

      return response;
    },
    retry: false,
  });
}

export default useRecoverySendCode;
