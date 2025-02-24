import React from "react";
import "../../styles/Spinner.css"; // Import du fichier CSS

const AtomSpinner = () => {
  return (
    <div className="atom-spinner">
      <div className="core"></div>
      <div className="orbit orbit-x"></div>
      <div className="orbit orbit-y"></div>
      <div className="orbit orbit-z"></div>
    </div>
  );
};

export default AtomSpinner;
