import React from "react";
import Layout from "../pages/components/Layout";
import "../styles/Documentation.css";
import { Helmet } from "react-helmet";

const Documentation = () => {
  return (
    <Layout>
      <Helmet>
        <title>Documentation - Guide d'utilisation</title>
        <meta
          name="description"
          content="Guide complet pour comprendre l'architecture et le fonctionnement de l'application."
        />
        <meta
          name="keywords"
          content="documentation, guide, API, tutoriel, architecture"
        />
        <meta name="author" content="Ton Nom" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content="Documentation - Guide d'utilisation"
        />
        <meta
          property="og:description"
          content="Guide complet pour comprendre l'architecture et le fonctionnement de l'application."
        />
        <meta
          property="og:url"
          content="https://blog.david-konate/documentation"
        />
        {/* <meta
          property="og:image"
          content="https://ton-site.com/images/documentation-banner.jpg"
        /> */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Documentation - Guide d'utilisation"
        />
        <meta
          name="twitter:description"
          content="Guide complet pour comprendre l'architecture et le fonctionnement de l'application."
        />
        {/* <meta
          name="twitter:image"
          content="https://ton-site.com/images/documentation-banner.jpg"
        /> */}
        <meta name="twitter:site" content="@TonTwitter" />
      </Helmet>
      <div className="documentation-container">
        <h1 className="text-3xl font-bold">Documentation de l'Application</h1>

        {/* Sommaire */}
        <nav>
          <ul>
            <li>
              <a href="#presentation">1. Présentation Générale</a>
            </li>
            <li>
              <a href="#frontend">2. Tier Présentation (Front-end)</a>
            </li>
            <li>
              <a href="#backend">3. Tier Application (Back-end)</a>
            </li>
            <li>
              <a href="#database">4. Tier Données (Base de données)</a>
            </li>
            <li>
              <a href="#deployment">5. Déploiement et Infrastructure</a>
            </li>
            <li>
              <a href="#articles">6. Gestion des Articles</a>
            </li>
          </ul>
        </nav>

        {/* Présentation Générale */}
        <section id="presentation">
          <h2>1. Présentation Générale</h2>
          <h3>Objectif de l'application</h3>
          <p>
            Application permettant la création et la gestion d'articles de blog
            avec CRUD.
          </p>

          <h3>Architecture Générale</h3>
          <p>Schéma de l'architecture :</p>
          <img
            src="/images/architecture-3-tier.png"
            alt="Architecture 3 tiers"
          />
        </section>

        {/* Environnement de Développement */}
        <section>
          <h2>Environnement de Développement</h2>
          <ul>
            <li>Node.js & npm</li>
            <li>MongoDB</li>
            <li>Cloudinary (stockage des fichiers)</li>
            <li>Gatsby (pour le front-end)</li>
          </ul>
          <h3>Installation</h3>
          <pre>
            {`git clone https://github.com/user/repo.git
cd repo
npm install
npm run dev`}
          </pre>
        </section>

        {/* Frontend */}
        <section id="frontend">
          <h2>2. Tier Présentation (Front-end)</h2>
          <h3>Technologies utilisées</h3>
          <ul>
            <li>React / Gatsby</li>
            <li>Context API / Provider</li>
            <li>Requêtes API avec Axios</li>
            <li>Markdown pour le contenu des articles</li>
          </ul>
        </section>

        {/* Backend */}
        <section id="backend">
          <h2>3. Tier Application (Back-end)</h2>
          <h3>Endpoints de l’API</h3>
          <details>
            <summary>Voir les endpoints</summary>
            <pre>
              {`GET /articles - Récupérer tous les articles
GET /article/:slug - Récupérer un article par slug
POST /save/:slug - Ajouter un article
PUT /update/:slug - Modifier un article
DELETE /article/:slug - Supprimer un article
POST /upload/:slug - Upload un fichier Markdown`}
            </pre>
          </details>

          <h3>Exemple de requête API</h3>
          <pre>
            {`curl -X GET https://blog-api.david-konate.fr/api/articles`}
          </pre>
        </section>

        {/* Base de données */}
        <section id="database">
          <h2>4. Tier Données (Base de données)</h2>
          <h3>Schéma de la base de données</h3>
          <details>
            <summary>Voir le schéma</summary>
            <pre>
              {`const articleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
  image: String,
  author: String,
  date: String,
  protected: Boolean,
});`}
            </pre>
          </details>
        </section>

        {/* Déploiement */}
        <section id="deployment">
          <h2>5. Déploiement et Infrastructure</h2>
          <p>Déploiement sur O2Switch avec gestion des environnements.</p>
        </section>

        {/* Gestion des articles */}
        <section id="articles">
          <h2>6. Gestion des Articles</h2>
          <h3>
            Service <code>useArticles</code>
          </h3>
          <details>
            <summary>Voir l'exemple de code</summary>
            <pre>
              {`const fetchArticles = async (page = 1, category = "") => {
  setLoading(true);
  const response = await fetch(
    \`https://blog-api.david-konate.fr/api/articles?page=\${page}&category=\${category}\`
  );
  const data = await response.json();
  setArticles(data);
};`}
            </pre>
          </details>
        </section>
      </div>
    </Layout>
  );
};

export default Documentation;
