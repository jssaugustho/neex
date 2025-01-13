import { lazy, Suspense } from "react";

import PrivateRoutes from "./PrivateRoutes.jsx";
import PreLoaderRoute from "./PreLoaderRoutes.jsx";

import Home from "../components/Home/Home.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

import AuthLayout from "../pages/AuthLayout/AuthLayout.jsx";
const Register = lazy(() => import("../components/Register/Register.jsx"));
const Login = lazy(() => import("../components/Login/Login.jsx"));
const Verify = lazy(() => import("../components/Verify/Verify.jsx"));

import ComponentLoader from "./ComponentLoader.jsx";
import Loader from "../components/Loader/Loader.jsx";
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
        element: <ComponentLoader />,
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<Loader />}>
                <Login />
              </Suspense>
            ),
          },
          {
            path: "register",
            element: (
              <Suspense fallback={<Loader />}>
                <Register />
              </Suspense>
            ),
          },

          {
            path: "verify",
            element: (
              <Suspense fallback={<Loader />}>
                <Verify />
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
            path: "dashboard",
            element: (
              <Suspense fallback={<PreLoader />}>
                <Dashboard />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];

export default AppRoutes;
