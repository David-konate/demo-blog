import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "../../styles/markdown-info.css";

const MarkdownInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="info-button info"
      >
        ℹ️
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div className="modal-overlay info" onClick={() => setIsOpen(false)}>
            <div
              className="modal-content info"
              onClick={(e) => e.stopPropagation()} // Empêche le clic intérieur de fermer la modale
            >
              <h2>📜 Règles d'écriture en Markdown</h2>

              <h3>📌 Titres</h3>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Balise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>### Titre</strong>
                    </td>
                    <td>
                      <code>H</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>#### Sous-titre</strong>
                    </td>
                    <td>
                      <code>H2</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>##### Sous-sous-titre</strong>
                    </td>
                    <td>
                      <code>H3</code>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>✍️ Mise en forme</h3>
              <table>
                <thead>
                  <tr>
                    <th>Style</th>
                    <th>Syntaxe Markdown</th>
                    <th>Rendu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Gras</strong>
                    </td>
                    <td>
                      <code>**Texte en gras**</code>
                    </td>
                    <td>
                      <b>Texte en gras</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Italique</strong>
                    </td>
                    <td>
                      <code>*Texte en italique*</code>
                    </td>
                    <td>
                      <i>Texte en italique</i>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>🔗 Images</h3>
              <p>
                Les images en Markdown sont ajoutées avec la syntaxe suivante :
                <code>![Texte alternatif](URL_de_l_image)</code>. Cela permet
                d'afficher des images avec un texte alternatif (pour
                l'accessibilité ou en cas de problème de chargement de l'image).
              </p>
              <table className="modal-content.info">
                <thead>
                  <tr>
                    <th>Syntaxe Markdown</th>
                    <th>Icône</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>
                        ![Texte alternatif](https://exemple.com/image.png)
                      </code>
                    </td>
                    <td>
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
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>📌 Indentation</h3>
              <table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Syntaxe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Ajoute 4 espaces</strong>
                    </td>
                    <td>
                      <code> --&gt;|</code>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Nouvelle section pour expliquer la balise <section> */}
              <h3>
                📦 Balise <code>&lt;section&gt;</code>
              </h3>
              <p>
                La balise <code>&lt;section&gt;</code> est utilisée pour
                délimiter une section distincte dans votre contenu. Elle permet
                de structurer votre texte en différentes sections, chacune ayant
                un contexte propre. Par exemple :
              </p>
              <section>
                <h4>
                  Exemple de contenu dans une <code>&lt;section&gt;</code>
                </h4>
                <p>
                  {`<section>`}
                  {`###   Mon Titre`}
                  <br></br>
                  {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et nulla id libero vehicula commodo. Quisque libero mauris, sagittis ac sapie`}{" "}
                  <br />
                  {` ![Une image de ....](https://exemple.com/image.png)`}
                  {`<section>`}
                </p>
              </section>
              <p>
                Chaque section est délimitée par la balise{" "}
                <code>&lt;section&gt;</code>
                au début et par <code>&lt;/section&gt;</code> à la fin. Cela
                permet de mieux organiser votre contenu et d'améliorer la
                lisibilité.
              </p>

              <button
                onClick={() => setIsOpen(false)}
                ref={closeButtonRef}
                className="close-button info-md"
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
