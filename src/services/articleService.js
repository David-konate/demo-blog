import { useState, useEffect } from "react";
import { marked } from "marked";
import trackerApi from "../api/tracker";

const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [articlePreview, setArticlePreview] = useState();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Vérifie si l'on est dans l'environnement du client
      // if (typeof window !== "undefined") {
      //   // Vérifie si les articles sont déjà en cache (sessionStorage)
      //   const cachedArticles = sessionStorage.getItem("articles");
      //   if (cachedArticles) {
      //     setArticles(JSON.parse(cachedArticles));
      //     setLoading(false);
      //     return;
      //   }
      // }

      // Sinon, récupère les articles depuis l'API
      const response = await fetch("http://localhost:3000/allArticles");
      const data = await response.json();

      const articlesWithContent = await Promise.all(
        data.data.map(async (article) => {
          const markdownResponse = await fetch(article.url);
          const content = await markdownResponse.text();

          const extractMetadata = (regex) => {
            const match = content.match(regex);
            return match ? match[1] : null;
          };

          const formattedArticle = {
            public_id: article.public_id,
            title:
              extractMetadata(/title:\s*"?(.+?)"?$/m) || "Titre non trouvé",
            author:
              extractMetadata(/author:\s*"?(.+?)"?$/m) || "Auteur non trouvé",
            date: extractMetadata(/date:\s*"?(.+?)"?$/m) || "Date non trouvée",
            category:
              extractMetadata(/category:\s*"?(.+?)"?$/m) ||
              "Catégorie non trouvée",
            slug: extractMetadata(/slug:\s*"?(.+?)"?$/m) || "Slug non trouvé",
            image:
              extractMetadata(/image:\s*"?(.+?)"?$/m) || "Image non trouvée",
            content: marked(content), // Convertit le Markdown en HTML
          };

          return formattedArticle;
        })
      );

      // Stocker en cache
      sessionStorage.setItem("articles", JSON.stringify(articlesWithContent));

      setArticles(articlesWithContent);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleBySlug = async (slug) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/article/${slug}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.data) {
        throw new Error("Article non trouvé");
      }

      const article = data.data;
      console.log("Données brutes de l'article:", article);

      // Vérification de l'URL du fichier Markdown
      if (!article.url) {
        throw new Error("URL du fichier Markdown manquante");
      }
      console.log("URL de l'article:", article.url);

      // Récupération du contenu Markdown
      const markdownResponse = await fetch(article.url);
      if (!markdownResponse.ok) {
        throw new Error("Erreur lors du chargement du fichier Markdown");
      }

      const content = await markdownResponse.text();
      console.log("Contenu Markdown brut:", content);

      // Extraction des métadonnées
      const extractMetadata = (regex) => {
        const match = content.match(regex);
        return match ? match[1] : null;
      };

      const title =
        extractMetadata(/title:\s*"?(.+?)"?$/m) || "Titre non trouvé";
      const author =
        extractMetadata(/author:\s*"?(.+?)"?$/m) || "Auteur non trouvé";
      const date = extractMetadata(/date:\s*"?(.+?)"?$/m) || "Date non trouvée";
      const category =
        extractMetadata(/category:\s*"?(.+?)"?$/m) || "Catégorie non trouvée";
      const image =
        extractMetadata(/image:\s*"?(.+?)"?$/m) || "Image non trouvée";
      const slugExtracted = extractMetadata(/slug:\s*"?(.+?)"?$/m) || slug;

      console.log("Métadonnées extraites:", {
        title,
        author,
        date,
        category,
        image,
        slugExtracted,
      });

      // Supprimer les métadonnées du contenu Markdown
      const cleanedMarkdown = content.replace(/^---[\s\S]+?---/, "").trim();
      console.log("Contenu Markdown nettoyé:", cleanedMarkdown);

      // Article formaté
      const formattedArticle = {
        public_id: article.public_id,
        title,
        author,
        date,
        image,
        category,
        slug: slugExtracted,
        created_at: article.created_at,
      };

      console.log("Article formaté :", formattedArticle);

      // Mise à jour du state
      setArticle(formattedArticle);
      setMarkdown(cleanedMarkdown);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'article:",
        error.message
      );
      setArticle(null);
      setMarkdown(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour générer le Markdown
  const createMarkdown = ({
    title,
    author,
    date,
    category,
    image,
    slug,
    content,
  }) => {
    return `---
  title: ${title}
  author: ${author}
  date: ${date}
  category: ${category}
  image: "${image}"
  slug: "${slug}"
  ---
  
  ${content}`;
  };

  // Enregistrer un article
  const saveArticle = async (articleData) => {
    console.log({ articleData });
    try {
      const uniqueSlug = await checkOrGenerateSlug(articleData.slug);

      // Mise à jour des métadonnées avec le slug unique
      const updatedArticleData = {
        ...articleData,
        slug: uniqueSlug,
      };

      console.log(updatedArticleData.image);
      const imageTitre = await saveImages(updatedArticleData);
      console.log(imageTitre);

      // Vérification si l'image a été correctement récupérée
      if (!imageTitre) {
        throw new Error("L'image n'a pas été correctement enregistrée");
      }

      // Génération du contenu Markdown
      const markdownContent = createMarkdown({
        ...updatedArticleData,
        image: imageTitre,
      });

      // Création d'un objet Blob avec le contenu Markdown
      const markdownBlob = new Blob([markdownContent], {
        type: "text/markdown",
      });

      // Création d'un objet File
      const markdownFile = new File([markdownBlob], `${uniqueSlug}.md`, {
        type: "text/markdown",
      });

      // Mise à jour des données finales avec le fichier Markdown
      const formData = new FormData();
      formData.append("markdown", markdownFile); // Ajout du fichier Markdown

      // Envoi des données avec le fichier Markdown
      const response = await trackerApi.post(
        `save/${uniqueSlug}`, // Utilisation du slug unique dans l'URL
        formData, // Envoi du FormData contenant le fichier
        {
          headers: {
            "Content-Type": "multipart/form-data", // Pour envoyer un fichier
          },
        }
      );

      if (response.status === 200) {
        console.log("Article enregistré avec succès :", response.data);
        return response.data;
      } else {
        throw new Error("Erreur lors de l'enregistrement de l'article");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'article :", error);
      throw error;
    }
  };

  // Enregistrer les images
  const saveImages = async (articleData) => {
    try {
      const formData = new FormData();
      console.log(articleData.image);
      // Gestion de l'image titre
      if (articleData.image) {
        const titleBlob = await fetch(articleData.image).then((res) =>
          res.blob()
        );
        formData.append("imageTitleData", titleBlob, "title.jpg");
      }

      const response = await trackerApi.post(
        `upload/images/${articleData.slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        return response.data.image_title_url;
      } else {
        throw new Error("Erreur lors du téléchargement des images.");
      }
    } catch (error) {
      console.error("Erreur dans saveImages:", error.message);
      throw error;
    }
  };

  // Vérifier ou générer un slug unique
  const checkOrGenerateSlug = async (slug) => {
    console.log({ slug });
    try {
      const response = await trackerApi.get(`check-or-generate-slug/${slug}`);
      console.log("Réponse API (checkOrGenerateSlug) :", response.data); // Debug

      if (response.data && response.data.uniqueSlug) {
        return response.data.uniqueSlug.trim(); // S'assurer qu'il n'y a pas d'espaces en trop
      } else {
        throw new Error(
          response.data.message || "Erreur lors de la vérification du slug."
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification ou génération du slug:",
        error
      );
      throw new Error("Erreur lors de la vérification du slug.");
    }
  };

  // Générer le contenu Markdown
  const generateMarkdown = (metadata) => {
    // Générer la section "metadata" en haut du fichier
    const metadataString = `---
    title: ${metadata.title}
    author: ${metadata.author}
    date: ${metadata.date}
    category: "${metadata.category || ""}"
    slug: "${metadata.slug || ""}"
    image: "${metadata.image || ""}"
    cardImage: "${metadata.cardImage || ""}"
    sections:
    ${metadata.sections
      .map(
        (section, index) => `  - text: "${section.text || ""}"
        index: ${index}
        image: "${section.image || ""}"
        position: { x: ${section.position?.x || "null"}, y: ${
          section.position?.y || "null"
        } }
        size: { width: ${section.size?.width || "100%"}, height: ${
          section.size?.height || "null"
        } }`
      )
      .join("\n")}
    ---`;

    // Générer le contenu détaillé des sections
    const sectionsContent = metadata.sections
      .map((section, index) => {
        const imageName = section.image || "";
        const imageDetails =
          section.image && section.position && section.size
            ? `\n* Position : (${section.position.x || "null"}, ${
                section.position.y || "null"
              })\n* Dimensions : ${section.size.width || "null"}x${
                section.size.height || "null"
              }`
            : "";

        return `### Section ${index + 1}
    
    ${imageName ? `![Image de la section](${imageName})` : ""}
    ${imageDetails}
    ${section.text || ""}`;
      })
      .join("\n\n");

    // Retourner le contenu Markdown complet
    return `${metadataString}\n\n${sectionsContent}`;
  };

  return {
    articles, // Liste des articles récupérés
    article, // Article spécifique actuellement sélectionné
    loading, // Indicateur de chargement pour les articles
    error, // Erreur si quelque chose ne va pas lors de la récupération des articles
    markdown, // Contenu markdown de l'article sélectionné
    fetchArticleBySlug, // Fonction pour récupérer un article spécifique par son slug
    saveArticle, // Fonction pour enregistrer un article
    saveImages, // Fonction pour enregistrer les images liées à un article
    checkOrGenerateSlug, // Fonction pour vérifier ou générer un slug unique
    generateMarkdown, // Fonction pour générer le contenu markdown complet d'un article
    articlePreview,
    setArticlePreview,
    fetchArticles,
  };
};

export default useArticles;
