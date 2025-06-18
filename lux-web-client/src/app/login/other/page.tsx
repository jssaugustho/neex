"use client";

import styles from "./other.module.css";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/button";
import { useOther } from "./other.context";

export default function Other() {
  const { selected, setSelected, CardOptions } = useOther();

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <h1 className={styles.title}>Selecione uma opção:</h1>
      </div>
      <div className={styles.cards}>
        {CardOptions.map((card, index) => {
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
          Próximo Passo <i className="icon fi fi-rr-arrow-right"></i>
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
