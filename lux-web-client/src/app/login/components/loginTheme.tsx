"use client";

import { useAuth } from "@/contexts/auth.context";
import styles from "./loginTheme.module.css";

export default function LoginTheme({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = useAuth();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <img
          className={styles.logo}
          src={`https://cloud.luxcrm.space/${session.theme}-theme-logo.png`}
          alt="logo"
        />
        <div className={styles.login}>{children}</div>
      </div>
    </div>
  );
}
