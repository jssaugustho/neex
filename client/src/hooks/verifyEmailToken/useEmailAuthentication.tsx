"use client";

import { useSendEmail } from "@/contexts/sendEmail.context";
import { useAuth } from "@/contexts/auth.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { log } from "console";
import { useAppRouter } from "@/contexts/navigation.context";

type SuccessType = {
  status: "Ok";
  message: string;
  token: string;
};

type ErrorType = {
  status:
    | "AuthError"
    | "UserError"
    | "TokenError"
    | "SessionError"
    | "InternalServerError";
  message: string;
};

type RecoveryRequisition = {
  token: string;
};

export const useEmailAuthentication = () => {
  const { api, preAuth, endSession } = useAuth();
  const { push } = useAppRouter();

  const queryClient = useQueryClient();

  return useMutation<SuccessType, AxiosError<ErrorType>, RecoveryRequisition>({
    mutationKey: ["authentication-email"],
    mutationFn: async ({ token }) => {
      const response = await api.post("/verification/email-authentication", {
        token,
      });

      if (!response?.data)
        throw new Error("Erro na requisição: /verification/authenticate");

      return response.data;
    },
    onSuccess: (response) => {
      if (response.status === "Ok") {
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
        preAuth(response.token);
        push("/login/remember");
      }
    },
    onError: (err) => {
      console.log(err);
      endSession();
    },
  });
};
