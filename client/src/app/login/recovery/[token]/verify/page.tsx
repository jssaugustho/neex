"use client";

import { useParams } from "next/navigation";

import Loader from "@/components/loader/loader";
import { useEffect } from "react";

import { useAppRouter } from "@/contexts/navigation.context";

import ChangePasswd from "@/components/changePasswd";
import { useVerify } from "@/hooks/recovery/useVerify";
import { useRecoveryContext } from "@/contexts/recovery.context";
import RecoveryFail from "@/components/verifyTokenFailed";
import { useChangePasswd } from "@/hooks/recovery/useChangePasswd";
import LogoutAllSessions from "@/components/logoutAllSessions";
import { useLogoutAllSessions } from "@/hooks/recovery/useLogoutAllSessions";

export default function VerifyToken() {
  const { token } = useParams();

  const { mutate: verifyToken, isPending: verifying, data } = useVerify();

  const { mutate: changePasswdMutate, isPending: changePasswdIsPending } =
    useChangePasswd();

  const {
    mutate: logoutAllSessionsMutate,
    isPending: isLogoutAllSessionsPending,
  } = useLogoutAllSessions();

  const { startTransition, push } = useAppRouter();

  const { step, errorMessage, email, passwd } = useRecoveryContext();

  const verify = () => {
    startTransition(() => {
      verifyToken({ token: token as string });
    });
  };

  const changePasswd = () => {
    startTransition(() => {
      changePasswdMutate({ newPasswd: passwd || "" });
    });
  };

  useEffect(() => {
    if (step === "DONE") push("/login/remember");

    if (step === "VERIFY_TOKEN") verify();
  }, [step]);

  const back = () => {
    localStorage.clear();
    push("/login");
  };

  if (step === "TIMEOUT")
    return (
      <RecoveryFail
        title="Tempo de sessão expirado."
        message={
          "Tempo de sessão expirado, reenvie o e-mail e tente novamente."
        }
        back={back}
        isLoading={verifying}
      />
    );

  if (step === "VERIFY_TOKEN") {
    if (errorMessage)
      return (
        <RecoveryFail
          title="Falha ao verificar o email."
          message={errorMessage}
          back={back}
          isLoading={verifying}
        />
      );

    return <Loader message="Verificando link..." />;
  }

  if (step === "CHANGE_PASSWD")
    return (
      <ChangePasswd
        errorMessage={errorMessage}
        isLoading={verifying}
        title="Altere sua senha antiga."
        description={
          <p className="paragraph">
            Altere a sua senha antiga para recuperar o acesso à sua conta:
            <b>{` ${email}`}</b>
          </p>
        }
        sendLabel="Redefinir Senha"
        back={back}
        backLabel="Voltar"
        onSubmit={changePasswd}
      />
    );

  if (step === "LOGOUT_ALL_SESSIONS")
    return (
      <LogoutAllSessions
        errorMessage={errorMessage}
        isLoading={verifying}
        title="Altere sua senha antiga."
        description={
          <p className="paragraph">
            Altere a sua senha antiga para recuperar o acesso à sua conta:
            <b>{` ${email}`}</b>
          </p>
        }
        sendLabel="Redefinir Senha"
        back={back}
        backLabel="Voltar"
        mutate={logoutAllSessionsMutate}
      />
    );

  if (step === "DONE") return <Loader message="Autenticando..." />;
}
