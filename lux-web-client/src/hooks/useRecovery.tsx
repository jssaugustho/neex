"use client";

import { formatMs, useOther } from "@/app/login/other/other.context";
import { useAuth } from "@/contexts/auth.context";
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
  status: "AuthError" | "UserError" | "TokenError" | "SessionError";
  message: string;
  info?: {
    timeLeft?: number;
  };
};

type RecoveryRequisition = {
  email: string;
};

export const useRecovery = () => {
  const { api } = useAuth();
  const { timeLeft, setTimeLeft, setTimeString, setSended } = useOther();

  return useMutation<SuccessType, AxiosError<ErrorType>, RecoveryRequisition>({
    mutationKey: ["recoveryEmail"],
    mutationFn: async ({ email }) => {
      const response = await api.post("/send-recovery-email", {
        email,
      });

      if (!response?.data) throw new Error("Erro na requisição: /recovery");

      return response.data;
    },
    onSuccess: (response) => {
      if (
        response.status === "Ok" &&
        typeof response.info?.timeLeft === "number"
      ) {
        setTimeLeft(response.info.timeLeft);
        setTimeString(formatMs(response.info?.timeLeft));
        setSended(true);
      }

      return response;
    },
    onError: (error) => {
      if (timeLeft >= 0 && error.response?.data.info?.timeLeft) {
        setTimeLeft(
          Math.floor(error.response?.data.info?.timeLeft / 1000) * 1000,
        );
        setTimeString(
          formatMs(
            Math.floor(error.response?.data.info?.timeLeft / 1000) * 1000,
          ),
        );
        setSended(true);
      }
    },
  });
};
