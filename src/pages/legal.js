import React from "react";
import "../styles/legal.css";
import Layout from "./components/layout";

const MentionsLegales = () => {
  return (
    <Layout>
      <div className="content-container">
        <h1>Mentions Légales</h1>

        <section>
          <h2>1. Éditeur du site</h2>
          <p>Le site internet www.blog.david-konate.fr est édité par :</p>
          <p>
            <strong>Nom de l’entreprise :</strong> David Konaté
          </p>
          <p>
            <strong>Forme juridique :</strong> Auto Entreprise
          </p>
          <p>
            <strong>Adresse :</strong> 4 Avenue Richelieu, 44100 Nantes, France
          </p>
          <p>
            <strong>Numéro de SIRET :</strong> 80184700500031
          </p>
          <p>
            <strong>Directeur de la publication :</strong> David Konaté
          </p>
          <p>
            <strong>Contact :</strong> da.konate@gmail.com
          </p>
        </section>

        <section>
          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par la société <strong>o2switch</strong>, dont
            les coordonnées sont :
          </p>
          <p>
            <strong>Nom de l’hébergeur :</strong> o2switch
          </p>
          <p>
            <strong>Adresse :</strong> 222-224 Boulevard Gustave Flaubert, 63000
            Clermont-Ferrand, France
          </p>
          <p>
            <strong>Numéro de téléphone :</strong> +33 4 44 44 60 40
          </p>
        </section>

        <section>
          <h2>3. Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur ce site (textes, images, vidéos,
            logos, etc.) sont la propriété exclusive de David Konaté, ou de ses
            partenaires si cela est spécifié. Toute reproduction, même
            partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2>4. Collecte de données personnelles</h2>
          <p>
            <strong>
              Responsable du traitement des données personnelles :
            </strong>{" "}
            David Konaté
          </p>
          <p>
            <strong>Finalité de la collecte des données :</strong> Les données
            personnelles sont collectées uniquement pour la gestion des
            utilisateurs et des abonnements.
          </p>
          <p>
            <strong>Partage des données :</strong> Nous ne partageons aucune
            donnée personnelle avec des tiers.
          </p>
          <p>
            <strong>Droits des utilisateurs :</strong> Les utilisateurs peuvent
            à tout moment demander la suppression de leurs comptes. Pour ce
            faire, veuillez nous contacter à l'adresse suivante :
            da.konate@gmail.com.
          </p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer l'expérience utilisateur
            et pour la gestion de la navigation. En poursuivant votre navigation
            sur ce site, vous acceptez l'utilisation de ces cookies.
          </p>
        </section>

        <section>
          <h2>6. Conditions Générales d'Utilisation (CGU)</h2>
          <p>
            Vous pouvez consulter nos{" "}
            <strong>Conditions Générales d'Utilisation</strong> en suivant ce
            lien : <a href="/terms">lien vers la page CGU</a>.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            Pour toute question relative à ce site, vous pouvez nous contacter
            par e-mail à l'adresse suivante :
          </p>
          <p>
            <strong>Email :</strong> da.konate@gmail.com
          </p>
          <p>
            <strong>Téléphone :</strong> 0763418790
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default MentionsLegales;
