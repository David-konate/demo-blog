import React, { useState, useEffect } from "react";
import Alert from "./components/Alert";
import BlogCard from "./components/BlogCard";
import useArticles from "../services/articleService";
import ButtonFilter from "./components/ButtonFilter";
import "../styles/list-blog.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Layout from "./components/layout";
import { navigate } from "gatsby";
import Spinner from "./components/Spinner";
import { Helmet } from "react-helmet";
import useCategories from "../services/categoryService";
import useAuth from "../services/authService";

const AllArticles = () => {
  const { user } = useAuth();
  const {
    articles,
    fetchArticles,
    getArticleCountByCategory,
    categoriesCount,
    deleteArticle,
    loading,
  } = useArticles();

  const { categories, getCategories } = useCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Stocke l'ID de la catégorie
  const articlesPerPage = 3;
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // Charger les catégories disponibles
    getCategories();
  }, []);

  useEffect(() => {
    // Effectuer l'appel avec l'ID de la catégorie sélectionnée
    fetchArticles(
      currentPage,
      selectedCategory, // Passer l'ID de la catégorie
      searchQuery,
      "",
      articlesPerPage
    );
    getArticleCountByCategory(); // Met à jour le nombre d'articles par catégorie
  }, [currentPage, selectedCategory, searchQuery, user]); // On ré-exécute l'effet chaque fois qu'une des dépendances change

  const totalArticles = categoriesCount.reduce(
    (total, { count }) => total + count,
    0
  );

  // Catégories avec le nombre d'articles associés
  const categoryCounts = categoriesCount.reduce((acc, { count, category }) => {
    acc[category] = count;
    return acc;
  }, {});

  // Création de la liste des catégories et leur nombre d'articles
  const categoriesAll = [
    { id: "", label_category: "Tous" }, // Ajouter une option "Tous" avec l'ID vide
    ...categories.map((cat) => ({
      id: cat.id, // Utilisation de l'ID de la catégorie
      label_category: cat.label_category, // Le label qui sera affiché
    })),
  ];

  const totalPages = Math.ceil(
    (categoryCounts[selectedCategory] || totalArticles) / articlesPerPage
  );

  const handleDeleteRequest = (article) => {
    setArticleToDelete(article);
    setAlertMessage({
      message: `Voulez-vous vraiment supprimer l'article "${article.title}" ?`,
      type: "warning",
      duration: 0,
      onConfirm: () => deleteArticle(article.slug),
    });
  };

  const handleUpdate = (article) => {
    navigate("/blog-update", { state: { slug: article.slug } });
  };

  return loading ? (
    <Layout>
      <Spinner />
    </Layout>
  ) : (
    <Layout>
      <Helmet>
        <title>Notre Blog - Articles sur la Tech, le Sport et plus</title>
      </Helmet>
      <div className="blog-container">
        <div className="blog-header">
          <h1>Notre blog</h1>
          <div className="category-filters">
            {categoriesAll.map((category) => {
              // Calcul du nombre d'articles pour chaque catégorie
              const categoryCount =
                category.id === "" // Si "Tous", on prend le total des articles
                  ? totalArticles
                  : categoryCounts[category.id] || 0;

              return (
                <ButtonFilter
                  key={category.id}
                  isActive={selectedCategory === category.id} // Vérifier si l'ID est sélectionné
                  onClick={() => {
                    setSelectedCategory(category.id); // Mettre à jour l'ID de la catégorie sélectionnée
                    setCurrentPage(1); // Réinitialiser la page à 1
                  }}
                >
                  {category.label_category} ({categoryCount})
                </ButtonFilter>
              );
            })}
          </div>
        </div>

        <div className="blog-content">
          {articles.length === 0 ? (
            <p className="loading-text">Aucun article trouvé.</p>
          ) : (
            <div className="articles-grid">
              {articles.map((post) => {
                const categoryObj = categories.find(
                  (cat) => cat.id === post.category // Trouver la catégorie en fonction de l'ID
                );

                return (
                  <BlogCard
                    key={post.public_id}
                    id={post.public_id}
                    title={post.title}
                    image={post.image}
                    category={categoryObj ? categoryObj.label_category : ""}
                    author={post.author}
                    slug={post.slug}
                    date={post.date}
                    content={post.content}
                    sections={post.sections}
                    protectedPost={post.protectedPost}
                    link={`/blog-post`}
                    onEdit={() => handleUpdate(post)}
                    onDelete={handleDeleteRequest}
                  />
                );
              })}
            </div>
          )}

          <div className="pagination">
            <button
              className="btn-pagination"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              <FaAngleLeft /> Précédent
            </button>
            <span className="pagination-info">
              Page {currentPage} / {totalPages || 1}
            </span>
            <button
              className="btn-pagination"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              Suivant <FaAngleRight />
            </button>
          </div>
        </div>

        {alertMessage && (
          <Alert
            message={alertMessage.message}
            type={alertMessage.type}
            duration={alertMessage.duration}
            visible={Boolean(alertMessage)}
            onClose={() => setAlertMessage(null)}
            onConfirm={alertMessage.onConfirm}
          />
        )}
      </div>
    </Layout>
  );
};

export default AllArticles;
