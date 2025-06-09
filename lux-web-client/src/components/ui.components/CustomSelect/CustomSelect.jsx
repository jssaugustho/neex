import "./CustomSelect.css";

import { useState } from "react";

function CustomSelect({
  options,
  placeholder = "Selecione...",
  defaultValue = false,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue ? defaultValue : null);

  function toggleDropdown() {
    setOpen((p) => !p);
  }

  function handleSelect(option) {
    setOpen(false);
    setSelected(option);
    onChange && onChange(option.value);
  }

  return (
    <div className={`select-container ${open ? "select-container-open" : ""}`}>
      <div
        className={`select-box ${open ? "select-box-open" : ""} ${
          selected ? "" : "select-placeholder"
        }`}
        onClick={toggleDropdown}
      >
        {selected ? selected.placeholder : placeholder}
        <i
          className={`select-icon fi fi-bs-angle-small-${open ? "up" : "down"}`}
        ></i>
      </div>
      {open && (
        <ul className="select-dropdown">
          {options.map((option, index) => {
            if (option != selected) {
              return (
                <li
                  className="option"
                  key={index}
                  onClick={() => handleSelect(option)}
                >
                  {option.placeholder}
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
