"use client";

import { useUser } from "@/hooks/useUser";
import styles from "./dashboard.module.css";
import { AuthGuard } from "@/contexts/auth.context";

export default function Dashboard() {
  const { data } = useUser();

  return (
    <AuthGuard>
      <div className={styles.content}>Bem vindo {data?.name || ""}!</div>
    </AuthGuard>
  );
}
