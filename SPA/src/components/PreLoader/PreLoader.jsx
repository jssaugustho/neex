import "./PreLoader.css";

import { motion } from "framer-motion";

import LoaderImage from "../../assets/loadImage.png";
import DarkLoaderImage from "../../assets/darkLoadImage.png";

import { useContext } from "react";
import ThemeContext from "../../contexts/theme/theme.context";

import BigLoadSpinner from "../../assets/BigLoadSpinner";

function PreLoader({ hide = false }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="pre-loader">
      <motion.div
        className="logo-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {hide ? null : (
          <img
            src={theme === "dark-theme" ? DarkLoaderImage : LoaderImage}
            alt="Lux CRM ©"
          />
        )}
        {hide ? null : <BigLoadSpinner className="loader" />}
      </motion.div>
    </div>
  );
}

export default PreLoader;
