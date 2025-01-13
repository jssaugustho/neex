import { useState } from "react";
import "./MiniSwitch.css";

function MiniSwitch({ name, onChange, required }) {
  const [active, setActive] = useState(false);

  const onClickHandler = (e) => {
    setActive(!active);
    onChange && onChange(e);
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
          required={required}
        />
        <span className="switch-slider"></span>
      </label>
    </>
  );
}

export default MiniSwitch;
