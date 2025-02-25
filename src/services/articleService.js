import { useState, useEffect } from "react";
import { marked } from "marked";
import trackerApi from "../api/tracker";
import { navigate } from "@reach/router";
const useArticles = () => {
  const [categoriesCount, setCategoriesCount] = useState([]);
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [articlePreview, setArticlePreview] = useState();

  useEffect(() => {
    // fetchArticles();
  }, []);

  const fetchArticles = async (page = 1, category = "") => {
    setLoading(true);
    const cacheKey = `articles_page_${page}_category_${category}`;

    try {
      // Requête API
      const queryParams = new URLSearchParams({ page, category }).toString();
      // const response = await fetch(
      //   `https://blog-api.david-konate.fr/api/articles?${queryParams}`
      // );
      const response = await fetch(
        `http://localhost:3000/api/articles?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des articles.");
      }

      const data = await response.json();

      // Récupération et traitement du contenu Markdown
      const articlesWithContent = await Promise.all(
        data.data.map(async (article) => {
          try {
            if (!article.fileUrl) {
              console.warn(
                `⚠️ Pas de fichier Markdown pour l'article ${article.slug}`
              );
              return { ...article, content: "Contenu indisponible" };
            }
            const content = await fetch(article.fileUrl).then((res) =>
              res.text()
            );
            const extract = (regex) =>
              content.match(regex)?.[1] || "Non spécifié";

            return {
              public_id: article.public_id,
              title: extract(/title:\s*"?(.+?)"?$/m),
              author: extract(/author:\s*"?(.+?)"?$/m),
              date: extract(/date:\s*"?(.+?)"?$/m),
              category: extract(/category:\s*"?(.+?)"?$/m),
              slug: extract(/slug:\s*"?(.+?)"?$/m),
              image: extract(/image:\s*"?(.+?)"?$/m),
              content: marked(content),
              protectedPost: article.protected,
            };
          } catch (error) {
            console.error(
              `❌ Erreur lors du chargement du contenu Markdown de ${article.slug}`,
              error
            );
            return {
              ...article,
              content: "Erreur lors du chargement du contenu.",
            };
          }
        })
      );
      // Mise en cache et mise à jour de l'état
      sessionStorage.setItem(cacheKey, JSON.stringify(articlesWithContent));
      setArticles(articlesWithContent);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des articles :", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleBySlug = async (slug) => {
    setLoading(true);
    try {
      const response = await trackerApi(`/article/${slug}`);

      const data = response.data; // Axios retourne déjà un objet JSON
      const article = data.data;

      // Vérification de l'URL du fichier Markdown
      if (!article.fileUrl) {
        throw new Error("URL du fichier Markdown manquante");
      }

      // Récupération du contenu Markdown
      const markdownResponse = await fetch(article.fileUrl);
      if (!markdownResponse.ok) {
        throw new Error("Erreur lors du chargement du fichier Markdown");
      }

      const content = await markdownResponse.text();

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

      // Supprimer les métadonnées du contenu Markdown
      const cleanedMarkdown = content.replace(/^---[\s\S]+?---/, "").trim();

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

  const saveArticle = async (articleData) => {
    console.log({ articleData });
    setLoading(true);
    try {
      const uniqueSlug = await checkOrGenerateSlug(articleData.slug);

      const updatedArticleData = {
        ...articleData,
        slug: uniqueSlug,
      };

      const imageTitre = await saveImages(updatedArticleData);

      if (!imageTitre) {
        throw new Error("L'image n'a pas été correctement enregistrée");
      }

      // Génération du contenu Markdown
      const markdownContent = createMarkdown({
        ...updatedArticleData,
        image: imageTitre,
      });

      // Création d'un Blob
      const markdownBlob = new Blob([markdownContent], {
        type: "text/markdown",
      });

      // Création d'un objet FormData
      const formData = new FormData();
      formData.append("markdown", markdownBlob, `${uniqueSlug}.md`);

      // Envoi de la requête
      const response = await trackerApi.post(`save/${uniqueSlug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error("Erreur lors de l'enregistrement de l'article");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'article :", error);
      throw error;
    } finally {
      setLoading(false);
      navigate("/blog-list/");
    }
  };

  // Mettre à jour un article existant
  const updateArticle = async (updatedData) => {
    setLoading(true);
    try {
      // Sauvegarde de l’image titre uniquement si elle n’est pas déjà une URL Cloudinary
      let imageTitre = updatedData.image;

      if (!imageTitre.startsWith("https://res.cloudinary.com/")) {
        imageTitre = await saveImages(updatedData);
      } else {
        console.log(
          "L'image provient déjà de Cloudinary, aucune mise à jour nécessaire."
        );
      }

      // Génération du contenu Markdown
      const markdownContent = createMarkdown({
        ...updatedData,
        image: imageTitre,
      });
      // Création d'un objet Blob avec le contenu Markdown
      const markdownBlob = new Blob([markdownContent], {
        type: "text/markdown",
      });

      // Création d'un objet File
      const markdownFile = new File([markdownBlob], `${updatedData.slug}.md`, {
        type: "text/markdown",
      });
      // Mise à jour des données avec le fichier Markdown
      const formData = new FormData();
      formData.append("markdown", markdownBlob, `${updatedData.slug}.md`);

      // Envoi de la requête
      const response = await trackerApi.put(
        `update/${updatedData.slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        fetchArticles(); // Rafraîchir la liste des articles
        return response.data;
      } else {
        throw new Error("Erreur lors de la mise à jour de l'article");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
      throw error;
    } finally {
      setLoading(false);
      navigate("/blog-list");
    }
  };

  // Supprimer un article par son slug
  const deleteArticle = async (slug) => {
    setLoading(true);
    try {
      const response = await trackerApi.delete(`article/${slug}`);
      if (response.status === 200) {
        fetchArticles(); // Rafraîchir la liste après suppression
      } else {
        throw new Error("Erreur lors de la suppression de l'article");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      throw error;
    } finally {
      setLoading(false);
      getArticleCountByCategory();
    }
  };

  // Enregistrer les images
  const saveImages = async (articleData) => {
    try {
      const formData = new FormData();
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
    try {
      const response = await trackerApi.get(`check-or-generate-slug/${slug}`);

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

  const getArticleCountByCategory = async () => {
    try {
      const response = await trackerApi.get("articles/count-by-category");
      if (response.status === 200) {
        setCategoriesCount(response.data.data); // Contient le nombre d'articles par catégorie
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  return {
    articles, // Liste des articles récupérés
    article, // Article spécifique actuellement sélectionné
    loading, // Indicateur de chargement pour les articles
    error, // Erreur si quelque chose ne va pas lors de la récupération des articles
    markdown, // Contenu markdown de l'article sélectionné
    setMarkdown,
    fetchArticleBySlug, // Fonction pour récupérer un article spécifique par son slug
    saveArticle, // Fonction pour enregistrer un article
    saveImages, // Fonction pour enregistrer les images liées à un article
    checkOrGenerateSlug, // Fonction pour vérifier ou générer un slug unique
    articlePreview,
    setArticlePreview,
    fetchArticles,
    deleteArticle,
    updateArticle,
    categoriesCount,
    getArticleCountByCategory,
    loading,
  };
};

export default useArticles;
