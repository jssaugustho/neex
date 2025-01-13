import "./Loader.css";

import { motion } from "framer-motion";

import BigLoadSpinner from "../../assets/BigLoadSpinner";

export default function Loader() {
  return (
    <motion.div
      className="login-motion-div"
      layoutId="Login"
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
      <div className="loader">
        <BigLoadSpinner className="loader" />
      </div>
    </motion.div>
  );
}
