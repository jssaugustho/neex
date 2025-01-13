import ThemeContext from "./theme.context.jsx";
import { useContext } from "react";

function useTheme() {
  return useContext(ThemeContext);
}

export default useTheme;
