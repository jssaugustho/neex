"use client";

import React from "react";
import styles from "./input.module.css";

type inputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input = React.memo(({ label, name, ...rest }: inputProps) => {
  return (
    <div className={styles.inputbox}>
      <div className={styles.labelBox}>
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      </div>
      <input name={name} id={name} className={styles.input} {...rest} />
    </div>
  );
});
