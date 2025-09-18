"use client";

import { useAuth } from "@/contexts/auth.context";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useRouter } from "next/navigation";

type SuccessType = {
  status: "Ok";
  message: string;
  info?: {
    timeLeft: number;
  };
  session: string;
  data: iUser;
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
  info?: {
    timeLeft?: number;
  };
};

type RecoveryRequisition = {
  email: string;
  passwd: string;
};

export const useLogin = () => {
  const { api, preAuth } = useAuth();
  const router = useRouter();

  return useMutation<SuccessType, AxiosError<ErrorType>, RecoveryRequisition>({
    mutationKey: ["recoveryEmail"],
    mutationFn: async ({ email, passwd }) => {
      const response = await api.post("/login", {
        email,
        passwd,
      });

      if (!response?.data) throw new Error("Erro na requisição: /login");

      return response.data;
    },
    onSuccess: (response) => {
      if (response.status === "Ok") {
        preAuth(response.token);
      }

      return response;
    },
  });
};
