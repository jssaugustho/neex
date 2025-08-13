import { useState } from "react";
import { Input } from "../input";
import styles from "./changePasswd.module.css";
import Button from "../button";
import { useRecoveryContext } from "@/contexts/recovery.context";

type ChangePasswdProps = {
  onSubmit: (passwd: string) => void;
  sendLabel: string;
  isLoading: boolean;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  back: () => void;
  backLabel: string;
  errorMessage: string | null;
};

export default function ChangePasswd(props: ChangePasswdProps) {
  const [confirmPasswd, setConfirmPasswd] = useState("");
  const { passwd, setPasswd } = useRecoveryContext();

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        {typeof props.title === "string" ? (
          <h1 className={"title"}>{props.title}</h1>
        ) : (
          props.title
        )}
        {typeof props.description === "string" ? (
          <p className={styles.paragraph}>{props.description}</p>
        ) : (
          props.description
        )}
      </div>
      <div className={styles.inputs}>
        <Input
          disabled={props.isLoading}
          placeholder="Digite sua nova senha."
          type="password"
          name="password"
          label="Nova Senha:"
          value={passwd || ""}
          onChange={(e) => setPasswd(e.target.value)}
        />
        <Input
          disabled={props.isLoading}
          placeholder="Confirme sua nova senha."
          type="password"
          name="password"
          label="Confirme:"
          value={confirmPasswd}
          onChange={(e) => setConfirmPasswd(e.target.value)}
        />
        {typeof props.errorMessage === "string" && (
          <p className={styles.errorMessage}>{props.errorMessage}</p>
        )}
      </div>
      <div className="buttons">
        <Button
          disabled={props.isLoading}
          type="submit"
          onClick={(e) => props.onSubmit(passwd || "")}
          background={props.isLoading ? "transparent" : "gradient"}
          className="submit"
        >
          {props.isLoading ? "Redefinindo senha..." : props.sendLabel}
        </Button>
        <Button
          disabled={props.isLoading}
          onClick={props.back}
          className="back"
          background={"transparent"}
          type="button"
        >
          {props.backLabel}
        </Button>
      </div>
    </div>
  );
}
