"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

type TransitionWrapperProps = {
  children: ReactNode;
  motionKey: string;
} & MotionProps;

export default function TransitionWrapper({
  children,
  motionKey,
  ...rest
}: TransitionWrapperProps) {
  return (
    <motion.div
      key={motionKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      {...rest} // Permite sobrescrever animações se quiser
    >
      {children}
    </motion.div>
  );
}
