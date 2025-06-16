"use client";

import { Input } from "@/components/input";

import styles from "./recovery.module.css";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/button";

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [sended, setSended] = useState(false);

  if (sended)
    return (
      <div className={styles.form}>
        <div className={styles.header}>
          <h1 className={styles.title}>Selecione uma opção:</h1>
          <Link className={styles.link} href="/login">
            Login com email e senha {">"}
          </Link>
        </div>
        <div className={styles.cards}></div>
        <button className={styles.submit} />
      </div>
    );
  else
    return (
      <div className={styles.form}>
        <div className={styles.header}>
          <h1 className={styles.title}>Recupere a sua senha</h1>
          <p className={styles.paragraph}>
            Envie um link de redefinição de senha para o seu email para
            recuperar seu acesso.
          </p>
        </div>
        <div className={styles.inputs}>
          <Input
            placeholder="Digite seu email."
            type="email"
            name="email"
            label="Email"
          />
        </div>
        <div className="buttons">
          <Button type="submit" background="gradient" className="submit">
            Enviar link no email
          </Button>
          <Button
            href={"/login/other"}
            className="back"
            background={"transparent"}
            type="button"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
}
