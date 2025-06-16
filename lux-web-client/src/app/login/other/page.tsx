"use client";

import styles from "./other.module.css";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/button";

type CardOption = {
  title: string;
  description: string;
  url: string;
};

export default function Other() {
  const options: CardOption[] = [
    {
      title: "Autenticar via email.",
      description: "Faça o login clicando em um link enviado no seu email.",
      url: "/login/other/email",
    },
    {
      title: "Esqueci a minha senha.",
      description: "Receba um link de redefinição de senha no seu email.",
      url: "/login/other/recovery",
    },
  ];

  const [selected, setSelected] = useState<CardOption>(options[0]);

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <h1 className={styles.title}>Selecione uma opção:</h1>
      </div>
      <div className={styles.cards}>
        {options.map((card, index) => {
          return (
            <div
              className={`${styles.card} ${
                selected.title === card.title ? styles.cardSelected : ""
              }`}
              tabIndex={0}
              onClick={() => setSelected(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSelected(card);
              }}
              key={index}
            >
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
              <div className={styles.cardIcon}>
                <i className="fi fi-sr-angle-right"></i>
              </div>
            </div>
          );
        })}
      </div>
      <div className="buttons">
        <Button
          href={selected.url}
          background="gradient"
          className={`submit`}
          type="button"
        >
          Próximo Passo
        </Button>
        <Button
          href={"/login"}
          className="back"
          background={"transparent"}
          type="button"
        >
          Login com email e senha
        </Button>
      </div>
    </div>
  );
}
