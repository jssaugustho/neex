"use client";

import styles from "./login.module.css";

import { ReactElement, useState } from "react";

import Link from "next/link";

export const Login = (children: ReactElement) => {
  const [email, setEmail] = useState(null);

  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="https://cloud.luxcrm.space/dark-theme-logo.png"
        alt="logo"
      />
      <div className={styles.login}>
        <div className={styles.header}>
          <h1 className={styles.title}>Faça login no CRM.</h1>
          <Link className={styles.link} href="/verify">
            Fazer login de outras formas {">"}
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};
