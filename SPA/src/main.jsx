import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import ThemeProvider from "./contexts/theme/theme.provider.jsx";
import AuthProvider from "./contexts/auth/auth.provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
