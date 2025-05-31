import { useMutation, useQueryClient } from "react-query";
import useAuth from "../useAuth/useAuth";

function useUpdateUser() {
  const { api } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.put("/user", data).then((r) => r.data);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
}

export default useUpdateUser;
