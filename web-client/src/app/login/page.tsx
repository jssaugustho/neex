"use client";

import { startTransition, useEffect, useLayoutEffect, useState } from "react";

import { Input } from "@/components/input";

import styles from "./login.module.css";
import Button from "@/components/button";
import { useLogin } from "@/hooks/useLogin";
import { PasswordInput } from "@/components/passwordInput";
import { useAuth } from "@/contexts/auth.context";
import { useAppRouter } from "@/contexts/navigation.context";

import TransitionWrapper from "@/components/transitionWrapper";
import { useSendEmail } from "@/contexts/sendEmail.context";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [passwd, setPasswd] = useState<string>("");

  const { push, router } = useAppRouter();

  const [msg, setMsg] = useState<{
    status: "err" | "msg" | null;
    message: string;
  }>({
    status: null,
    message: "",
  });

  const { session } = useAuth();

  const { setEmail: setSendEmail } = useSendEmail();

  const { mutateAsync, isPending, isError, isSuccess, data } = useLogin();

  useEffect(() => {
    if (session.signed) push("/");
  }, [router, session.signed]);

  useLayoutEffect(() => {
    const storage = localStorage.getItem("session@email");
    if (storage) {
      setEmail(storage);
    }
  }, []);

  return (
    <TransitionWrapper motionKey={"login"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email && !passwd) {
            setMsg({
              status: "err",
              message: "Informe seu email e senha.",
            });
            return;
          }
          if (!email) {
            setMsg({
              status: "err",
              message: "Informe seu email.",
            });
            return;
          }

          if (!passwd) {
            setMsg({
              status: "err",
              message: "Informe sua senha.",
            });
            return;
          }

          startTransition(async () => {
            await mutateAsync({ email, passwd })
              .then(() => {
                push("/login/remember");
              })
              .catch((err) => {
                if (
                  err.response?.data.status === "UserError" ||
                  err.response?.data.status === "AuthError"
                ) {
                  return setMsg({
                    status: "err",
                    message: err.response?.data.message,
                  });
                }

                if (err.response?.data.status === "SessionError") {
                  setSendEmail(email);
                  localStorage.setItem("session@email", email);
                  push("/login/verify-session");
                }

                return setMsg({
                  status: "err",
                  message:
                    process.env.NODE_ENV === "production"
                      ? "Erro interno."
                      : err.response?.data.message || "Erro desconhecido.",
                });
              });
          });
        }}
        className={styles.form}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>Faça login na Dashboard.</h1>
          <p className={styles.linkParagraph}>
            Esqueceu sua senha?{" "}
            <span
              className={styles.link}
              onClick={() => {
                push("/login/recovery");
              }}
            >
              Clique aqui.
            </span>
          </p>
        </div>
        <div className={styles.inputBox}>
          <div className={styles.inputs}>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Digite seu email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              name="passwd"
              id="passwwd"
              placeholder="Digite sua senha"
              label="Senha"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
            />

            {isError && msg.status && (
              <div className={styles.msgBox}>
                <i className="fi fi-rr-info"></i>
                {msg.message}
              </div>
            )}
          </div>
          <div className={styles.passwdBox}>
            <Button
              disabled={isPending || isSuccess}
              background="gradient"
              className={`submit`}
              type="submit"
            >
              {isPending
                ? "Fazendo Login..."
                : isSuccess
                ? "Entrando..."
                : "Fazer Login"}
            </Button>
          </div>
        </div>
      </form>
    </TransitionWrapper>
  );
}
