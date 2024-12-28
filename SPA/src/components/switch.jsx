import { useState } from "react";
import "./switch.css";

function Switch({ name, onChange }) {
  const [active, setActive] = useState(false);

  const onClickHandler = () => {
    setActive(!active);
    onChange && onChange(!active);
  };

  return (
    <>
      <label className="switch-label" htmlFor={name}>
        <input
          className="switch-checkbox"
          type="checkbox"
          name={name}
          id={name}
          onClick={onClickHandler}
        />
        <span className="switch-slider"></span>
        <span className="switch-fill"></span>
      </label>
    </>
  );
}

export default Switch;
