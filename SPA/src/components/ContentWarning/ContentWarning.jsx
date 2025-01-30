import "./ContentWarning.css";

function ContentWarning({ children }) {
  return (
    <div className="content-box align-left content-warning">
      <p className="paragraph content-warning-text">{children}</p>
    </div>
  );
}

export default ContentWarning;
