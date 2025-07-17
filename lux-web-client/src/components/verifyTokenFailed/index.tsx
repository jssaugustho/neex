import { useAppRouter } from "@/contexts/navigation.context";
import Button from "../button";
import styles from "./verifyTokenFailed.module.css";

export default function VerifyTokenFailed({
  isLoading,
  back,
}: {
  isLoading: boolean;
  back: () => void;
}) {
  const { push } = useAppRouter();

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <h1 className="title">Falha ao verificar o email.</h1>
        <p className="paragraph">
          Não foi possível verificar o seu email utilizando esse link, por favor
          tente novamente.
        </p>
      </div>
      <Button
        type="button"
        disabled={isLoading}
        onClick={back}
        background={isLoading ? "transparent" : "gradient"}
        className="submit"
      >
        {isLoading ? "Verificando..." : "Reenviar Email"}
      </Button>
    </div>
  );
}
