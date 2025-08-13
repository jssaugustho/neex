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
  logout: boolean;
};

export const useLogoutAllSessions = () => {
  const { api } = useAuth();
  const { setTimeLeft, setStep, setErrorMessage, setInitialized } =
    useRecoveryContext();

  return useMutation<SuccessType, AxiosError<ErrorType>, RequisitionType>({
    mutationKey: ["verifyRecovery"],
    mutationFn: async ({ logout }) => {
      const response = await api.post("/recovery/logout-all-sessions", {
        logout,
      });

      if (!response?.data)
        throw new Error("Erro na requisição: /recovery/logout-all-sessions");

      return response.data;
    },
    onSuccess: (response) => {
      setStep("DONE");

      localStorage.removeItem("recovery@step");

      setTimeLeft(0);
      setInitialized(false);

      return response;
    },
    onError: (error) => {
      localStorage.removeItem("recovery@step");
      setErrorMessage(
        error.response?.data.message ||
          "Erro ao fazer o logotu das sessões, tente novamente.",
      );
      setTimeLeft(0);
      setInitialized(false);
    },
  });
};
