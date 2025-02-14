import "./Dashboard.css";

import { Outlet } from "react-router";

import useAuth from "../../hooks/useAuth/useAuth.jsx";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

const Dashboard = () => {
  const { toggleNavBar } = useAuth();

  return (
    <div className="dashboard">
      <Sidebar />
      <main
        className={`${
          toggleNavBar ? "collapse " : ""
        }y-scroll-section content-box main-content`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
