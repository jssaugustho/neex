import ThemeContext from "./theme.context";

import { useLayoutEffect, useState } from "react";

import useAuth from "../auth/auth.hook";

function ThemeProvider({ children }) {
  let userTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const [theme, setTheme] = useState(`${userTheme}-theme`);
  localStorage.setItem("theme", userTheme);

  useLayoutEffect(() => {
    let loadTheme = localStorage.getItem("theme");

    if (loadTheme) {
      setTheme(`${loadTheme}-theme`);
      localStorage.setItem("theme", loadTheme);
    }
  }, []);

  function changeTheme(e) {
    setTheme(`${e}-theme`);
    localStorage.setItem("theme", e);
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
