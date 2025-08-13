import { useAppRouter } from "@/contexts/navigation.context";
import Button from "../button";
import styles from "./verifyTokenSuccess.module.css";
import { useEffect, useState } from "react";

export default function VerifyTokenSuccess({
  title,
  description,
  isLoading,
  redirect,
}: {
  title: string;
  description: string;
  isLoading: boolean;
  redirect?: string | null;
}) {
  const { push } = useAppRouter();
  const [time, setTime] = useState(5000);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirect) {
        if (time <= 0) push(redirect);

        if (time >= 1000) setTime((prev) => prev - 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, redirect]);

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <i className="fi fi-br-check"></i>
        </div>
        <h1 className="title">{title}.</h1>
        <p className="paragraph">{description}</p>
      </div>
      <Button
        type="button"
        disabled={isLoading || (redirect && time > 0)}
        onClick={() => {
          push("/dashboard");
        }}
        background={isLoading ? "transparent" : "gradient"}
        className="submit"
      >
        {isLoading
          ? "Verificando..."
          : redirect && time > 0
          ? `Redirecionando em ${time / 1000}s`
          : "Ir para a Dashboard"}
      </Button>
    </div>
  );
}
