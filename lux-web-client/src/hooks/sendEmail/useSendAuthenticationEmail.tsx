"use client";

import { useAuth } from "@/contexts/auth.context";
import { formatMs, useSendEmail } from "@/contexts/sendEmail.context";
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

type RecoveryRequisition = {
  email: string;
};

export const useSendAuthenticationEmail = () => {
  const { api } = useAuth();
  const { setTimeLeft, setTimeString, setSended } = useSendEmail();

  return useMutation<SuccessType, AxiosError<ErrorType>, RecoveryRequisition>({
    mutationKey: ["emailAuthentication"],
    mutationFn: async ({ email }) => {
      const response = await api.post("/send-authentication-email", {
        email,
      });

      if (!response?.data)
        throw new Error("Erro na requisição: /send-authentication-email");

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

        7;
      }

      return response;
    },
    onError: (error) => {
      if (error.response?.data.info?.timeLeft) {
        setTimeLeft(
          Math.floor(error.response?.data.info?.timeLeft / 1000) * 1000 + 5000,
        );
        setTimeString(
          formatMs(
            Math.floor(error.response?.data.info?.timeLeft / 1000) * 1000 +
              5000,
          ),
        );
        setSended(true);
      }
    },
  });
};
