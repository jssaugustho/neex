import "./CtaItem.css";

import useAuth from "../../../../contexts/auth/auth.hook";

function CtaItem({ children, icon = "fi fi-rr-dashboard", onClick }) {
  const { toggleNavBar } = useAuth();

  return (
    <li className={`content-box cta-item ${toggleNavBar ? "collapse" : ""}`}>
      <div className="content-box cta-bg">
        <button
          className={`flex-row-center align-left small-gap nav-link cta-btn  ${
            !toggleNavBar ? "cta-btn-collapse" : ""
          }`}
          onClick={(e) => {
            onClick && onClick(e);
          }}
        >
          {icon && (
            <div className="content-box cta-icon-box">
              <i className={`${icon} cta-icon`}></i>
            </div>
          )}
          <p className={`paragraph cta-text-btn ${toggleNavBar ? "hide" : ""}`}>
            {children}
          </p>
        </button>
      </div>
    </li>
  );
}

export default CtaItem;
