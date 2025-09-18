"use client";

import { useState } from "react";
import styles from "./passwordInput.module.css";

type inputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const PasswordInput = ({ label, name, ...rest }: inputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.inputbox}>
      <div className={styles.labelBox}>
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      </div>
      <div className={styles.internalInputBox}>
        <input
          type={show ? "text" : "password"}
          name={name}
          id={name}
          className={styles.input}
          {...rest}
        />
        <div className={styles.hide} onClick={() => setShow((old) => !old)}>
          <i className={`fi fi-rr-eye${show ? "-crossed" : ""}`}></i>
        </div>
      </div>
    </div>
  );
};
