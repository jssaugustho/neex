import { Outlet } from "react-router";

import { Suspense } from "react";

import DashboardLoader from "../components/DashboardLoader/DashboardLoader.jsx";

const DashboardLoaderRoutes = () => {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <Outlet />
    </Suspense>
  );
};

export default DashboardLoaderRoutes;
