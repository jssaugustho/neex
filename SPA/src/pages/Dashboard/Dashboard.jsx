import "./Dashboard.css";

import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="y-scroll-section content-box main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
