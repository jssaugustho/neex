"use client";

import { useAuth } from "@/contexts/auth.context";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SuccessType = {
  status: "Ok";
  message: "E-mail verificado com sucesso.";
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
  token: string;
};

export const useVerifyEmail = () => {
  const { api } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<SuccessType, AxiosError<ErrorType>, RecoveryRequisition>({
    mutationKey: ["verify-email"],
    retry: false,
    mutationFn: async ({ token }) => {
      const response = await api.post("/verify-email", {
        token,
      });

      if (!response?.data) throw new Error("Erro na requisição: /verify-email");

      return response.data;
    },
    onSuccess: (response) => {
      if (response.status === "Ok") {
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
      }

      return response;
    },
  });
};
