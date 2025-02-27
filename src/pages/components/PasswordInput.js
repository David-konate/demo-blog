import React, { useState } from "react";
import "../../styles/login.css"; // Assurez-vous que les styles sont bien inclus

const PasswordInput = ({ value, onChange, placeholder, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-container">
      <input
        className="login-input"
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? "👁‍🗨" : "👁"}
      </span>
    </div>
  );
};

export default PasswordInput;
