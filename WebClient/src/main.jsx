import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import ThemeProvider from "./contexts/theme/theme.provider.jsx";
import AuthProvider from "./contexts/auth/auth.provider.jsx";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
