// src/pages/privacy-policy.js

import React from "react";
import { Link } from "gatsby";
import Layout from "./components/layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="content-container">
        <h1>Politique de Confidentialité</h1>

        <section>
          <h2>1. Introduction</h2>
          <p>
            La présente politique de confidentialité a pour objectif de vous
            informer sur la manière dont nous collectons, utilisons, protégeons
            et partageons vos informations personnelles lorsque vous utilisez
            notre service. Nous nous engageons à respecter la confidentialité et
            la sécurité de vos données personnelles.
          </p>
        </section>

        <section>
          <h2>2. Collecte des données personnelles</h2>
          <p>
            Nous collectons les informations suivantes lorsque vous utilisez
            notre service :
          </p>
          <ul>
            <li>
              <strong>Informations personnelles</strong> : nom, adresse email,
              et d’autres informations que vous nous fournissez lors de votre
              inscription ou interaction avec notre CRM.
            </li>
            <li>
              <strong>Données de navigation</strong> : nous collectons également
              des données de navigation via des cookies pour améliorer
              l’expérience de l’utilisateur sur notre site.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation des données personnelles</h2>
          <p>
            Les informations que nous collectons sont utilisées pour les
            finalités suivantes :
          </p>
          <ul>
            <li>Fournir, gérer et personnaliser votre compte utilisateur.</li>
            <li>
              Améliorer votre expérience sur notre site et assurer le bon
              fonctionnement de notre CRM.
            </li>
            <li>
              Vous envoyer des newsletters ou des notifications si vous êtes
              propriétaire d'un compte.
            </li>
            <li>
              Vous permettre d'échanger avec les administrateurs via notre
              système de messagerie sous forme de tickets.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Partage des données personnelles</h2>
          <p>
            Nous ne partageons pas vos données personnelles avec des tiers, sauf
            dans les cas suivants :
          </p>
          <ul>
            <li>
              Avec des prestataires ou partenaires tiers nécessaires pour le bon
              fonctionnement du service.
            </li>
            <li>
              Lorsque la loi l'exige ou pour protéger nos droits ou ceux de nos
              utilisateurs.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Sécurisation des données personnelles</h2>
          <p>
            Nous mettons en place des mesures de sécurité strictes pour protéger
            vos informations personnelles contre tout accès non autorisé,
            altération, divulgation ou destruction.
          </p>
        </section>

        <section>
          <h2>6. Utilisation des cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer la performance et la
            fonctionnalité de notre site. Vous pouvez gérer vos préférences de
            cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2>7. Vos droits sur vos données personnelles</h2>
          <p>
            Conformément à la législation en vigueur sur la protection des
            données personnelles, vous avez les droits suivants :
          </p>
          <ul>
            <li>
              <strong>Droit d'accès</strong> : vous pouvez accéder à vos données
              personnelles que nous avons collectées.
            </li>
            <li>
              <strong>Droit de rectification</strong> : vous pouvez demander la
              modification de vos données personnelles.
            </li>
            <li>
              <strong>Droit à l'effacement</strong> : vous pouvez demander la
              suppression de vos données personnelles.
            </li>
            <li>
              <strong>Droit de limitation du traitement</strong> : vous pouvez
              limiter l'utilisation de vos données personnelles dans certaines
              situations.
            </li>
          </ul>
        </section>

        <section>
          <h2>8. Modifications de la politique de confidentialité</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de
            confidentialité à tout moment. Les modifications seront publiées sur
            cette page avec la date de la mise à jour.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Si vous avez des questions concernant cette politique de
            confidentialité ou si vous souhaitez exercer vos droits, vous pouvez
            nous contacter à l'adresse suivante :
            <a href="mailto:da.konate@gmail.com">da.konate@gmail.com</a>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
