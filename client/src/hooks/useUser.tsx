import { useAuth } from "@/contexts/auth.context";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ErrorType = AxiosError<{
  status:
    | "AuthError"
    | "UserError"
    | "TokenError"
    | "SessionError"
    | "InternalServerError";
  message: string;
}>;

type SuccessType = iUser;

export const useUser = () => {
  const { api, session, initializeSession } = useAuth();

  return useQuery<SuccessType, ErrorType>({
    enabled: session.signed,
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/user");

      if (response.data?.status !== "Ok")
        throw new Error("Erro na requisição: /user");

      let user = response.data?.data;

      initializeSession(user, session.remember ? true : false);

      return user;
    },
    refetchInterval: 15 * 1000,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: 3,
    retryDelay: 1000,
  });
};
