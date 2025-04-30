import { Outlet } from "react-router";

import { Suspense } from "react";

import AuthLoader from "../components/AuthLoader/AuthLoader.jsx";

const AuthLoaderRoutes = () => {
  return (
    <Suspense fallback={<AuthLoader />}>
      <Outlet />
    </Suspense>
  );
};

export default AuthLoaderRoutes;
