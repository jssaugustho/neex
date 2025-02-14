import { lazy } from "react";

import PrivateRoutes from "./PrivateRoutes.jsx";

import Home from "../components/Home/Home.jsx";

import AuthLayout from "../pages/AuthLayout/AuthLayout.jsx";
import AuthLoaderRoutes from "./AuthLoaderRoutes.jsx";

const Register = lazy(() => import("../components/Register/Register.jsx"));
const Login = lazy(() => import("../components/Login/Login.jsx"));
const Verify = lazy(() => import("../components/Verify/Verify.jsx"));
const Recovery = lazy(() => import("../components/Recovery/Recovery.jsx"));

import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import DashboardLoader from "../components/DashboardLoader/DashboardLoader.jsx";

const VisaoGeral = lazy(() =>
  import("../components/VisaoGeral/VisaoGeral.jsx")
);
const Leads = lazy(() => {
  return import("../components/Leads/Leads.jsx");
});
const Campanhas = lazy(() => import("../components/Campanhas/Campanhas.jsx"));
const Formularios = lazy(() =>
  import("../components/Formularios/Formularios.jsx")
);
const Paginas = lazy(() => import("../components/Paginas/Paginas.jsx"));
const Configuracoes = lazy(() =>
  import("../components/Configuracoes/Configuracoes.jsx")
);
const Plan = lazy(() => import("../components/Plan/Plan.jsx"));

import Loader from "../components/AuthLoader/AuthLoader.jsx";

import DashboardLoaderRoutes from "./DashboardLoaderRoutes.jsx";
import PreLoader from "../components/PreLoader/PreLoader.jsx";

const AppRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <AuthLoaderRoutes />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "verify",
            element: <Verify />,
          },
          {
            path: "recovery",
            element: <Recovery />,
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoutes />,
    errorElement: <PreLoader />,
    children: [
      {
        element: <Dashboard />,
        children: [
          {
            element: <DashboardLoaderRoutes />,
            errorElement: <Loader />,
            children: [
              {
                path: "dashboard",
                element: <VisaoGeral />,
              },
              {
                path: "leads",
                element: <Leads />,
              },
              {
                path: "campanhas",
                element: <Campanhas />,
              },
              {
                path: "forms",
                element: <Formularios />,
              },
              {
                path: "pages",
                element: <Paginas />,
              },
              {
                path: "plan",
                element: <Plan />,
              },
              {
                path: "settings",
                element: <Configuracoes />,
              },
              {
                path: "*",
                element: <DashboardLoader />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default AppRoutes;
