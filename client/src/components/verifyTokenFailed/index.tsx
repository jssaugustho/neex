import { useAppRouter } from "@/contexts/navigation.context";
import Button from "../button";
import styles from "./verifyTokenFailed.module.css";

export default function RecoveryFailed({
  isLoading,
  back,
  message,
  title,
}: {
  isLoading: boolean;
  back: () => void;
  message: string;
  title: string;
}) {
  const { push } = useAppRouter();

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <h1 className="title">{title}</h1>
        <p className="paragraph">{message}</p>
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
