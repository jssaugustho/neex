import "./NavItem.css";

import { useState } from "react";

import { NavLink, useLocation } from "react-router";
import useAuth from "../../../contexts/auth/auth.hook";

function NavItem({
  children,
  icon = "fi fi-rr-dashboard",
  link = "#",
  subLinks = [],
  cta = false,
}) {
  const { toggleNavBar } = useAuth();

  const [showSub, setShowSub] = useState(false);

  const location = useLocation();

  const isActive = subLinks.filter((subLink) => {
    if (subLink.link.includes(location.pathname)) {
      return true;
    }
  });

  return (
    <li
      className={`nav-item ${cta ? `accent-nav-item` : ""} ${
        toggleNavBar ? "hide-nav-item" : ""
      }`}
    >
      {cta ? (
        <div className="content-box gradient-bg nav-cta-bg">
          <button
            className={`flex-row-center align-left small-gap nav-link accent-link  ${
              toggleNavBar ? "hide-nav-link" : ""
            }`}
            to="#"
          >
            {icon && (
              <div className="content-box nav-icon-box">
                <i className={`${icon} cta-icon`}></i>
              </div>
            )}
            <p
              className={`nav-link-text accent-link-text ${
                toggleNavBar ? "hide" : ""
              }`}
            >
              {children}
            </p>
          </button>
        </div>
      ) : (
        <div
          onMouseOver={() =>
            setShowSub((p) => {
              return toggleNavBar && subLinks.length > 0 ? !p : false;
            })
          }
          onMouseLeave={() => setShowSub(() => false)}
          className={`content-box ${
            showSub
              ? subLinks.length > 0
                ? toggleNavBar
                  ? "nav-link-box-active-sub-link-collapse"
                  : "nav-link-box-active-sub-link"
                : "nav-link-box-active"
              : subLinks.length > 0
              ? toggleNavBar
                ? "nav-link-box-sub-link-collapse"
                : "nav-link-box-sub-link"
              : "nav-link-box"
          }`}
        >
          <NavLink
            className={`inline-flex-center align-left small-gap nav-link  ${
              subLinks.length > 0 ? "nav-link-with-toggle" : ""
            } ${toggleNavBar ? "hide-nav-link" : ""}`}
            to={link}
          >
            {icon && (
              <div className="content-box nav-icon-box">
                <i className={`${icon} nav-icon`}></i>
              </div>
            )}
            <p className={`nav-link-text ${toggleNavBar ? "hide" : ""}`}>
              {children}
            </p>
            {subLinks.length > 0 && !toggleNavBar && (
              <div className="content-box toggle-chevron-box">
                <i
                  className={`fi fi-rr-angle-small-down toggle-chevron-icon ${
                    showSub ? "rotate" : ""
                  }`}
                ></i>
              </div>
            )}
          </NavLink>
          <ul
            className={`content-box sub-items mini-gap ${
              showSub || isActive.length > 0
                ? toggleNavBar
                  ? "sub-items-invisible"
                  : "sub-items-visible"
                : "sub-items-invisible"
            } ${toggleNavBar ? "zero-height-sub-items" : ""}`}
          >
            {subLinks.map((subLink, index) => (
              <li key={index} className="content-box">
                <NavLink
                  className={`paragraph ${
                    subLink.link === location.pathname
                      ? "sub-nav-link-active"
                      : "sub-nav-link"
                  }`}
                  to={subLink.link}
                >
                  {subLink.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NavItem;
