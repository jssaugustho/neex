import "./FolderItem.css";

import useAuth from "../../../../contexts/auth/auth.hook";
import { Navigate, NavLink, useLocation } from "react-router";
import { useState } from "react";

function FolderItem({
  children,
  icon = "fi fi-rr-dashboard",
  link,
  subLinks = [],
}) {
  const { toggleNavBar } = useAuth();

  const location = useLocation();

  const isActive = location.pathname.includes(link);
  const subIsActive = subLinks.filter((link) => {
    if (location.pathname.includes(link)) return true;

    return false;
  });

  const [showSub, setShowSub] = useState(false);

  return (
    <li className={`content-box folder-item ${toggleNavBar ? "collapse" : ""}`}>
      <div className="content-box">
        <div
          className={`content-box align-left folder-link folder-a mini-gap ${
            toggleNavBar ? "folder-btn-collapse" : ""
          } ${isActive ? "folder-a-active" : ""}`}
          onClick={() => {
            Navigate(link);
          }}
        >
          <div className={`flex-row-center align-left small-gap`}>
            {icon && (
              <div className="content-box folder-icon-box">
                <i className={`${icon} folder-icon`}></i>
              </div>
            )}
            <p
              className={`paragraph folder-text-btn ${
                toggleNavBar ? "hide" : ""
              }`}
            >
              {children}
            </p>
          </div>

          <ul className={`content-box sub-items mini-gap`}>
            {subLinks.map((subLink, index) => (
              <li key={index} className="content-box">
                <NavLink className={`paragraph`} to={subLink.link}>
                  {subLink.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export default FolderItem;
