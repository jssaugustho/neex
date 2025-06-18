"use client";

import Link from "next/link";
import { useState } from "react";

import { Input } from "@/components/input";

import styles from "./login.module.css";
import Button from "@/components/button";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [passwd, setPasswd] = useState<string>("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Email: ", email);
        console.log("Senha: ", passwd);
      }}
      className={styles.form}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Faça login no CRM.</h1>
        <Link className={styles.link} href="/login/other">
          Faça login de outra forma {">"}
        </Link>
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
          <Input
            type="password"
            name="passwd"
            id="passwwd"
            placeholder="Digite sua senha"
            label="Senha"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
          />
        </div>
        <Button background="gradient" className={`submit`} type="submit">
          Fazer Login
        </Button>
      </div>
    </form>
  );
}
