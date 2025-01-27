import { useEffect, useState } from "react";

import { NavLink, useLocation } from "react-router";

function NavItem({
  children,
  icon = "fi fi-rr-dashboard",
  link = "#",
  subLinks = [],
  cta = false,
}) {
  const [showSub, setShowSub] = useState(false);

  const location = useLocation();

  const isActive = subLinks.filter((subLink) => {
    if (subLink.link.includes(location.pathname)) {
      return true;
    }
  });

  return (
    <li className={`nav-item ${cta ? "accent-nav-item" : ""}`}>
      {cta ? (
        <div className="content-box gradient-bg nav-cta-bg">
          <button
            className="flex-row-center align-left small-gap nav-link accent-link"
            to="#"
          >
            {icon && (
              <div className="content-box nav-icon-box">
                <i className={`${icon} nav-icon`}></i>
              </div>
            )}
            <p className="nav-link-text">{children}</p>
          </button>
        </div>
      ) : (
        <div
          onMouseOver={() => setShowSub(subLinks.length > 0 ? true : false)}
          onMouseLeave={() => setShowSub(false)}
          className={`content-box ${
            link.includes(location.pathname) || isActive.length > 0
              ? subLinks.lenght > 0
                ? "nav-link-box-active-sub-link"
                : "nav-link-box-active"
              : "nav-link-box"
          }`}
        >
          <NavLink
            className="inline-flex-center align-left small-gap nav-link"
            to={link}
          >
            {icon && (
              <div className="content-box nav-icon-box">
                <i className={`${icon} nav-icon`}></i>
              </div>
            )}
            <p className="nav-link-text">{children}</p>
            {subLinks.length > 0 && (
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
              showSub || isActive.length > 0 ? "visible" : "invisible"
            }`}
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
