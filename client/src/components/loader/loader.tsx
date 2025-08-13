"use client";

import { useAuth } from "@/contexts/auth.context";
import styles from "./loader.module.css";
import TransitionWrapper from "../transitionWrapper";

export default function Loader({
  message,
  showLogo,
}: {
  message?: string;
  showLogo?: boolean;
}) {
  const { session } = useAuth();

  return (
    <TransitionWrapper motionKey="loader">
      <div className={styles.loaderContainer}>
        {showLogo && (
          <img
            className={styles.logo}
            src={`https://cloud.luxcrm.space/${session.theme}-theme-logo.png`}
            alt="logo"
          />
        )}
        <div className={styles.loader}></div>
        {message && <p className={styles.paragraph}>{message}</p>}
      </div>
    </TransitionWrapper>
  );
}
