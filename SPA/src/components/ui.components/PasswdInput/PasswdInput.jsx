import "./PasswdInput.css";

import { useState } from "react";

import ShowIcon from "../../../assets/ShowIcon";
import HideIcon from "../../../assets/HideIcon";

function PasswdInput({
  name,
  onChange,
  placeholder = "••••••••••••••••",
  showPlaceholder = "Sua senha",
  value,
  required = true,
}) {
  const [status, setStatus] = useState({
    hide: true,
    placeholder,
  });

  function handleClick() {
    setStatus({
      hide: !status.hide,
      placeholder: status.hide ? showPlaceholder : placeholder,
    });
  }

  function handleOnChange(msg) {
    onChange && onChange(msg);
  }

  return (
    <div className="passwd-input">
      <input
        type={status.hide ? "password" : "text"}
        placeholder={status.placeholder}
        name={name}
        id={name}
        required={required}
        value={value}
        onChange={handleOnChange}
      />
      <div className="icon" onClick={handleClick}>
        {status.hide ? <ShowIcon /> : <HideIcon />}
      </div>
    </div>
  );
}

export default PasswdInput;
