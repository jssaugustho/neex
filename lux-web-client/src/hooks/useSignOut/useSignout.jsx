import { useMutation, useQueryClient } from "react-query";
import useAuth from "../useAuth/useAuth";

function useSignout() {
  const { api, setUser, setSigned, setNextStep } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api
        .get(`/session/logout`, {
          headers: {
            Authorization: api.defaults.headers.common["Authorization"] || "",
          },
        })
        .then((r) => r.data);

      return response;
    },
    onSuccess: async () => {
      queryClient.clear();
      sessionStorage.clear();
      localStorage.clear();
      setSigned(false);
      setUser({});
      setNextStep(null);
      delete api.defaults.headers.common["Authorization"];
    },
    retry: false,
  });
}

export default useSignout;
