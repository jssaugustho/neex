import "./NavItem.css";

import useAuth from "../../../../contexts/auth/auth.hook";
import { NavLink, useLocation } from "react-router";

function NavItem({ children, icon = "fi fi-rr-dashboard", link }) {
  const { toggleNavBar } = useAuth();

  const location = useLocation();

  const isActive = location.pathname.includes(link);

  return (
    <li className={`content-box nav-item ${toggleNavBar ? "collapse" : ""}`}>
      <div className="content-box">
        <NavLink
          className={`flex-row-center align-left nav-link nav-a small-gap ${
            toggleNavBar ? "nav-btn-collapse" : ""
          } ${isActive ? "nav-a-active" : ""}`}
          to={link}
        >
          {icon && (
            <div className="content-box nav-icon-box">
              <i className={`${icon} nav-icon`}></i>
            </div>
          )}
          <p className={`paragraph nav-text-btn ${toggleNavBar ? "hide" : ""}`}>
            {children}
          </p>
        </NavLink>
      </div>
    </li>
  );
}

export default NavItem;
