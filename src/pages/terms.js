import React from "react";
import { Link } from "gatsby";
import Layout from "./components/layout";

const TermsOfService = () => (
  <Layout>
    <div className="content-container">
      <h1>Conditions Générales d'Utilisation (CGU)</h1>

      <section>
        <h2>Introduction</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent
          l'accès et l'utilisation du site CRM développé et géré par David
          Konaté. En accédant à ce site, vous acceptez les présentes conditions.
        </p>
      </section>

      <section>
        <h2>1. Accès au site</h2>
        <p>
          Le site CRM est destiné aux entreprises de toutes tailles. Pour
          accéder à certaines fonctionnalités, une connexion est requise (via
          email/mot de passe ou Google). L'utilisation des services est soumise
          à une inscription préalable.
        </p>
      </section>

      <section>
        <h2>2. Responsabilité des utilisateurs</h2>
        <p>
          L'utilisateur est responsable du contenu qu'il publie, notamment des
          articles, et doit veiller à respecter les lois en vigueur. La création
          d'articles illégaux, diffamatoires ou respectant les règles est
          strictement interdite.
        </p>
        <p>
          Si un utilisateur crée du contenu illégal ou irrespectueux, son compte
          sera immédiatement désactivé et supprimé.
        </p>
      </section>

      <section>
        <h2>3. Utilisation saine</h2>
        <p>
          Il est interdit de :
          <ul>
            <li>Publier des articles illégaux ou nuisibles.</li>
            <li>Envoyer des messages abusifs via le système de tickets.</li>
            <li>Diffuser des logiciels malveillants.</li>
            <li>
              Accéder sans autorisation aux informations d'autres utilisateurs.
            </li>
            <li>
              Altérer le fonctionnement du CRM ou du site de manière non
              autorisée.
            </li>
          </ul>
        </p>
      </section>

      <section>
        <h2>4. Suppression de compte</h2>
        <p>
          Un utilisateur peut supprimer son compte à tout moment en accédant à
          son profil. En cas de violation des CGU, le compte de l'utilisateur
          pourra être supprimé sans préavis.
        </p>
      </section>

      <section>
        <h2>5. Contact</h2>
        <p>
          En cas de question ou de litige, l'utilisateur doit nous contacter via
          le bouton "Nous Contacter" situé dans la barre de navigation du CRM.
        </p>
      </section>

      <section>
        <h2>6. Modifications des CGU</h2>
        <p>
          David Konaté se réserve le droit de modifier ces CGU à tout moment.
          Les utilisateurs seront informés de ces modifications via un email ou
          une notification sur la plateforme.
        </p>
      </section>

      <section>
        <h2>7. Loi applicable</h2>
        <p>
          Ces CGU sont régies par la législation française. En cas de litige, le
          tribunal compétent sera situé à Nantes.
        </p>
      </section>
    </div>
  </Layout>
);

export default TermsOfService;
