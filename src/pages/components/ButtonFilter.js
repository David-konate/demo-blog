import React from "react";

const ButtonFilter = ({ children, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        margin: "5px",
        border: "none",
        borderRadius: "20px",
        backgroundColor: isActive ? "#007bff" : "#e0e0e0",
        color: isActive ? "white" : "black",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s ease",
      }}
    >
      {children}
    </button>
  );
};

export default ButtonFilter;
