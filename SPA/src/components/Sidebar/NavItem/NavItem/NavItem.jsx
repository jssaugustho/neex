import "./NavItem.css";

import useAuth from "../../../../contexts/auth/auth.hook";
import { useNavigate, useLocation } from "react-router";

function NavItem({ children, icon = "fi fi-rr-dashboard", link }) {
  const { toggleNavBar } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname.includes(link);

  function ConditionalNavLink({ className, children, to }) {
    function handleClick() {
      if (!isActive) navigate(to);
    }
    return (
      <div
        role={`${!isActive && "button"}`}
        tabIndex={`${!isActive && 0}`}
        className={className}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key == "Enter") handleClick();
        }}
      >
        {icon && (
          <div className="content-box nav-icon-box">
            <i className={`${icon} nav-icon`}></i>
          </div>
        )}
        <p className={`paragraph nav-text-btn ${toggleNavBar ? "hide" : ""}`}>
          {children}
        </p>
      </div>
    );
  }

  return (
    <li
      className={`content-box align-left nav-item ${
        toggleNavBar ? "collapse" : ""
      }`}
    >
      <div className="content-box align-left">
        <ConditionalNavLink
          to={link}
          className={`flex-row-center align-left nav-link nav-a mini-gap ${
            toggleNavBar ? "nav-btn-collapse" : ""
          } ${isActive ? "nav-a-active" : ""}`}
        >
          {children}
        </ConditionalNavLink>
      </div>
    </li>
  );
}

export default NavItem;
