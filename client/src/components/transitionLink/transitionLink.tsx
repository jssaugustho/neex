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
} & React.ComponentPropsWithoutRef<"div">) {
  const { push } = useAppRouter();

  return (
    <span
      {...props}
      className={styles.link}
      onClick={() => {
        push(url);
      }}
    >
      {children}
    </span>
  );
}
