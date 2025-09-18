"use client";

import { useSendEmail } from "@/contexts/sendEmail.context";
import { useAuth } from "@/contexts/auth.context";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type SuccessType = {
  status: "Ok";
  message: string;
  data: iUser;
  remember: boolean;
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
  remember: boolean;
};

export const useAuthentication = () => {
  const { api, initializeSession, endSession } = useAuth();

  return useMutation<SuccessType, AxiosError<ErrorType>, RecoveryRequisition>({
    mutationKey: ["recoveryEmail"],
    mutationFn: async ({ remember }) => {
      const response = await api.post("/authenticate", {
        remember,
      });

      if (!response?.data) throw new Error("Erro na requisição: /authenticate");

      response.data.remember = remember;

      return response.data;
    },
    onSuccess: (response) => {
      initializeSession(response.data, response.remember);

      return response;
    },
    onError: () => {
      endSession();
    },
  });
};
