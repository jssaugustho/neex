"use client";

import { useAuth } from "@/contexts/auth.context";
import { useRecoveryContext } from "@/contexts/recovery.context";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type SuccessType = {
  status: "Ok";
  message: string;
  data: {
    email: string;
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
};

type RequisitionType = {
  token: string;
};

export const useVerify = () => {
  const { api } = useAuth();
  const { setTimeLeft, setStep, setErrorMessage, setInitialized, setEmail } =
    useRecoveryContext();

  return useMutation<SuccessType, AxiosError<ErrorType>, RequisitionType>({
    mutationKey: ["verifyRecovery"],
    mutationFn: async ({ token }) => {
      const response = await api.post("/recovery/verify", { token });

      if (!response?.data)
        throw new Error("Erro na requisição: /recovery/verify");

      return response.data;
    },
    onSuccess: (response) => {
      localStorage.setItem("recovery@step", "CHANGE_PASSWD");
      setStep("CHANGE_PASSWD");

      setEmail(response.data.email);
      localStorage.setItem("session@email", response.data.email);

      setTimeLeft(1000 * 60 * 10);

      setInitialized(true);

      return response;
    },
    onError: (error) => {
      localStorage.removeItem("recovery@step");
      setErrorMessage(
        error.response?.data.message ||
          "Erro ao validar o link, reenvie o email e tente novamente.",
      );
      setInitialized(false);
      setTimeLeft(0);
    },
  });
};
