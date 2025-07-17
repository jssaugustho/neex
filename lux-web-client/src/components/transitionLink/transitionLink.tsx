import Link from "next/link";
import React from "react";

import styles from "./transitionLink.module.css";
import { useAppRouter } from "@/contexts/navigation.context";

export function TransitionLink({
  children,
  url,
  ...props
}: {
  url: string;
  children: React.ReactNode;
}) {
  const { push } = useAppRouter();

  return (
    <div
      {...props}
      onClick={() => {
        push(url);
      }}
    >
      <span className={styles.link}>{children}</span>
    </div>
  );
}
