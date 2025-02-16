import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../styles/blog-editor.css";

const MarkdownInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="info-button">
        ℹ️
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>📜 Règles d'écriture en Markdown</h2>

              <h3>📌 Titres</h3>
              <ul>
                <li>
                  <strong>### titre </strong> H
                </li>
                <li>
                  <strong>#### Sous-titre</strong> H2
                </li>
                <li>
                  <strong>##### Sous-sous-titre</strong> H3
                </li>
              </ul>

              <h3>✍️ Mise en forme</h3>
              <ul>
                <li>
                  <strong>**Texte en gras**</strong> <b>B</b>
                </li>
                <li>
                  <strong>*Texte en italique*</strong> <i>I</i>
                </li>
              </ul>

              <h3>🔗 Images</h3>
              <ul>
                <li>
                  <strong>
                    ![Texte alternatif](https://exemple.com/image.png)
                  </strong>
                  <svg
                    width="50"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      stroke="black"
                      stroke-width="2"
                      fill="none"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="2"
                      stroke="black"
                      stroke-width="2"
                      fill="none"
                    />
                    <path
                      d="M3 18L9 12L14 16L18 12L21 15"
                      stroke="black"
                      stroke-width="2"
                      fill="none"
                    />
                  </svg>
                </li>
              </ul>

              <h3>📌 Indentation</h3>
              <ul>
                <li>
                  <strong> Ajoute 4 espaces</strong>
                  --&gt;|
                </li>
              </ul>
              <button
                onClick={() => setIsOpen(false)}
                ref={closeButtonRef}
                className="close-button"
              >
                Fermer
              </button>
            </div>
          </div>,
          document.body // Rend la modale dans <body> pour éviter les interférences avec le DOM
        )}
    </div>
  );
};

export default MarkdownInfo;
