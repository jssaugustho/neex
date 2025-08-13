"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import styles from "./topLoading.module.css";

export function TopLoading({ loading }: { loading: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (loading) setShow(true);
    else {
      let timeout = setTimeout(() => {
        setShow(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="top-bar"
          initial={{ width: "5%" }}
          animate={{ width: "100%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={styles.loading}
        />
      )}
    </AnimatePresence>
  );
}
