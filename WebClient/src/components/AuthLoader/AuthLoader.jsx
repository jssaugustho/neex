import "./AuthLoader.css";

import { motion } from "framer-motion";

export default function AuthLoader() {
  return (
    <motion.div
      className="content-box auth-loader"
      layoutId="AuthLoader"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
      }}
    >
      <div className="loader"></div>
    </motion.div>
  );
}
