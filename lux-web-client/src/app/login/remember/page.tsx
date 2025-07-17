"use client";

import { useAuth } from "@/contexts/auth.context";
import styles from "./remember.module.css";
import Button from "@/components/button";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppRouter } from "@/contexts/navigation.context";

export default function Remember() {
  const { push } = useAppRouter();
  const { isPending, mutate } = useAuthentication();

  const { session } = useAuth();

  const handleClick = (remember: boolean) => {
    mutate({
      token: session.token || "",
      remember,
    });
  };

  useEffect(() => {
    if (session.signed) {
      push("/dashboard");
      return;
    }

    if (!session.token) push("/login");
  }, [session]);

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lembrar deste dispositivo?</h1>
        <p className={styles.description}>
          Isso evita que você precise fazer login toda vez neste dispositivo.
          Não use em computadores públicos.
        </p>
      </div>
      <div className={styles.inputBox}>
        <Button
          disabled={isPending}
          background="gradient"
          className={`submit`}
          type="submit"
          onClick={() => handleClick(true)}
        >
          Sim
        </Button>

        <Button
          disabled={isPending}
          background="transparent"
          className={`back`}
          type="submit"
          onClick={() => handleClick(false)}
        >
          Não
        </Button>
      </div>
    </div>
  );
}
