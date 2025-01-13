import "./PasswdForceLevel.css";

function PasswdForceLevel({ level, lost }) {
  let status = "";

  if (level == 0) {
    status = "full";
  }
  if (level == 1) {
    status = "medium";
  }
  if (level >= 2) {
    status = "low";
  }

  return (
    <div className="passwd-force-box">
      <div className="slider">
        <span className={`bar ${status}`}></span>
      </div>
      {level > 0 ? (
        <div className="msg">
          <p className="lost-title">Você deve incluir na sua senha: </p>
          {lost.map((p) => {
            return (
              <p key={p} className="lost">
                {p}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default PasswdForceLevel;
