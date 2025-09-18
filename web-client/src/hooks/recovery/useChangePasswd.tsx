"use client";

import { useAuth } from "@/contexts/auth.context";
import { useRecoveryContext } from "@/contexts/recovery.context";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type SuccessType = {
  status: "Ok";
  message: string;
  info?: {
    timeLeft: number;
  };
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

type RequisitionType = {
  newPasswd: string;
};

export const useChangePasswd = () => {
  const { api } = useAuth();
  const { setTimeLeft, setStep, setErrorMessage, setInitialized } =
    useRecoveryContext();

  return useMutation<SuccessType, AxiosError<ErrorType>, RequisitionType>({
    mutationKey: ["verifyRecovery"],
    mutationFn: async ({ newPasswd }) => {
      const response = await api.post("/recovery/set-new-password", {
        newPasswd,
      });

      if (!response?.data)
        throw new Error("Erro na requisição: /recovery/set-new-password");

      return response.data;
    },
    onSuccess: (response) => {
      setStep("LOGOUT_ALL_SESSIONS");

      setTimeLeft(1000 * 60 * 10);
      setInitialized(true);

      return response;
    },
    onError: (error) => {
      localStorage.removeItem("recovery@step");
      setErrorMessage(
        error.response?.data.message ||
          "Erro ao alterar senha, reenvie o email e tente novamente.",
      );
      setTimeLeft(0);
      setInitialized(false);
    },
  });
};
