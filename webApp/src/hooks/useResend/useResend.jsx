import { useMutation, useQueryClient } from "react-query"; // (React Query atualizado usa @tanstack/react-query)
import useAuth from "../useAuth/useAuth";

function useResend() {
  const queryClient = useQueryClient();

  const { api } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await api.get("/resend");
      return response.data;
    },
    retry: false,
  });
}

export default useResend;
