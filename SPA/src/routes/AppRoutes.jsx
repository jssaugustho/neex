import { lazy, Suspense } from "react";

import PrivateRoutes from "./PrivateRoutes.jsx";
import PreLoaderRoute from "./PreLoaderRoutes.jsx";

import Home from "../components/Home/Home.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

import AuthLayout from "../pages/AuthLayout/AuthLayout.jsx";
const Register = lazy(() => import("../components/Register/Register.jsx"));
const Login = lazy(() => import("../components/Login/Login.jsx"));
const Verify = lazy(() => import("../components/Verify/Verify.jsx"));
const Recovery = lazy(() => import("../components/Recovery/Recovery.jsx"));
const VisaoGeral = lazy(() =>
  import("../components/VisaoGeral/VisaoGeral.jsx")
);
const Leads = lazy(() => import("../components/Leads/Leads.jsx"));
const Campanhas = lazy(() => import("../components/Campanhas/Campanhas.jsx"));
const Formularios = lazy(() =>
  import("../components/Formularios/Formularios.jsx")
);
const Paginas = lazy(() => import("../components/Paginas/Paginas.jsx"));
const Configuracoes = lazy(() =>
  import("../components/Configuracoes/Configuracoes.jsx")
);

import ComponentLoader from "./ComponentLoader.jsx";
import Loader from "../components/AuthLoader/AuthLoader.jsx";
import PreLoader from "../components/PreLoader/PreLoader.jsx";
import AuthLayoutLoader from "./ComponentLoader.jsx";
import AuthLoader from "../components/AuthLoader/AuthLoader.jsx";
import DashboardLoader from "../components/DashboardLoader/DashboardLoader.jsx";

const AppRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <AuthLayoutLoader />,
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<AuthLoader />}>
                <Login />
              </Suspense>
            ),
          },
          {
            path: "register",
            element: (
              <Suspense fallback={<AuthLoader />}>
                <Register />
              </Suspense>
            ),
          },

          {
            path: "verify",
            element: (
              <Suspense fallback={<AuthLoader />}>
                <Verify />
              </Suspense>
            ),
          },
          {
            path: "recovery",
            element: (
              <Suspense fallback={<AuthLoader />}>
                <Recovery />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <PreLoaderRoute />,
        children: [
          {
            element: (
              <Suspense fallback={<PreLoader />}>
                <Dashboard />
              </Suspense>
            ),
            errorElement: <Loader />,
            children: [
              {
                path: "dashboard",
                element: (
                  <Suspense fallback={<DashboardLoader />}>
                    <VisaoGeral />
                  </Suspense>
                ),
              },
              {
                path: "leads",
                element: (
                  <Suspense fallback={<DashboardLoader />}>
                    <Leads />
                  </Suspense>
                ),
              },
              {
                path: "campanhas",
                element: (
                  <Suspense fallback={<DashboardLoader />}>
                    <Campanhas />
                  </Suspense>
                ),
              },
              {
                path: "forms",
                element: (
                  <Suspense fallback={<DashboardLoader />}>
                    <Formularios />
                  </Suspense>
                ),
              },
              {
                path: "pages",
                element: (
                  <Suspense fallback={<DashboardLoader />}>
                    <Paginas />
                  </Suspense>
                ),
              },
              {
                path: "settings",
                element: (
                  <Suspense fallback={<DashboardLoader />}>
                    <Configuracoes />
                  </Suspense>
                ),
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
