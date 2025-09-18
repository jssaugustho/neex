import { useMutation } from "@tanstack/react-query";

import { useAppRouter } from "@/contexts/navigation.context";
import { useAuth } from "@/contexts/auth.context";

type SuccessType = {
  status: "Ok";
  message: string;
};

type ErrorType = {
  status:
    | "AuthError"
    | "UserError"
    | "TokenError"
    | "SessionError"
    | "InternalServerError";
  message: string;
  info?: {
    timeLeft?: number;
  };
};

export const useLogout = () => {
  const { api, endSession } = useAuth();
  const { push } = useAppRouter();

  return useMutation<SuccessType, ErrorType>({
    mutationKey: ["recovery"],
    mutationFn: async () => {
      const response = await api.get("/session/logout");

      return response.data;
    },
    onSuccess: () => {
      push("/login");
      endSession();
    },
    retry: 5,
    retryDelay: 1000,
  });
};
