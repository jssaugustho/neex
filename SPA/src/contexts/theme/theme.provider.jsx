import ThemeContext from "./theme.context";

import { useLayoutEffect, useState } from "react";

function ThemeProvider({ children }) {
  const userTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const [theme, setTheme] = useState(`${userTheme}-theme`);

  useLayoutEffect(() => {
    const loadTheme = localStorage.getItem("theme");

    if (loadTheme == "dark-theme") {
      setTheme("dark-theme");
    } else if (loadTheme == "light-theme") {
      setTheme("light-theme");
    } else {
      setTheme(`${userTheme}-theme`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function changeTheme(e) {
    setTheme(e);
    localStorage.setItem("theme", `${e}-theme`);
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      changeTheme(theme == "dark-theme" ? "light-theme" : "dark-theme");
    });

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
