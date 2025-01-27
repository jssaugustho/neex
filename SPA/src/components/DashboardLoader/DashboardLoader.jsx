import "./DashboardLoader.css";

import { motion } from "framer-motion";

export default function DashboardLoader() {
  return (
    <motion.div
      className="fill"
      layoutId="DashboardLoader"
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
