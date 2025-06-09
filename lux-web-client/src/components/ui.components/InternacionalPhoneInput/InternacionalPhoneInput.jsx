import { PhoneInput } from "react-international-phone";
import "./InternacionalPhoneInput.css";

function InternacionalPhoneInput({
  onChange,
  required = true,
  value,
  defaultCountry,
  name,
}) {
  function handleOnChange(e) {
    onChange && onChange(e);
  }

  return (
    <div className="input-box">
      <PhoneInput
        className="phone-input"
        value={value}
        defaultCountry={defaultCountry}
        onChange={handleOnChange}
        required={required}
        name={name}
        id={name}
      />
    </div>
  );
}

export default InternacionalPhoneInput;
