//REACT HOOKS
import { useContext } from "react";

//CSS GLOBAL
import "./App.css";

//ROTAS GLOBAIS DA APLICAÇÃ
import AppRoutes from "./routes/AppRoutes.jsx";

//THEME CONTEXT
import ThemeContext from "./contexts/theme/theme.context.jsx";

import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter(AppRoutes);

function App() {
  const themeData = useContext(ThemeContext);

  return (
    <div className={`y-scroll-section app ${themeData.theme}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
