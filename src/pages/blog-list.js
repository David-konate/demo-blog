import React, { useState, useEffect } from "react";
import Alert from "./components/Alert"; // Assurez-vous d'importer l'alerte
import BlogCard from "./components/BlogCard";
import useArticles from "../services/articleService";
import ButtonFilter from "./components/ButtonFilter";
import "../styles/list-blog.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Layout from "./components/layout";
import { navigate } from "gatsby";

const AllArticles = () => {
  const {
    articles,
    fetchArticles,
    getArticleCountByCategory,
    categoriesCount,
    deleteArticle,
    updateArticle,
  } = useArticles();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null); // Ajouter un état pour l'alerte

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(
        "Fetching articles for page:",
        currentPage,
        "category:",
        selectedCategory
      );
      await fetchArticles(
        currentPage,
        selectedCategory !== "Tous" ? selectedCategory : ""
      );
      await getArticleCountByCategory();
      setLoading(false);
    };

    fetchData();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    setDisplayedArticles(articles);
  }, [articles]);

  const totalArticles = categoriesCount.reduce(
    (total, { count }) => total + count,
    0
  );
  const categoryCounts = categoriesCount.reduce((acc, { count, category }) => {
    acc[category] = count;
    return acc;
  }, {});

  const categories = [
    "Tous",
    ...categoriesCount.map(({ category }) => category),
  ];

  const totalPages = Math.ceil(
    (categoryCounts[selectedCategory] || totalArticles) / articlesPerPage
  );

  const handleDeleteRequest = (article) => {
    setArticleToDelete(article);
    setAlertMessage({
      message: `Voulez-vous vraiment supprimer l'article "${article.title}" ?`,
      type: "warning", //"success", "error", "warning", "info"
      duration: 0, // Set duration to 0 so the alert remains until action
      onConfirm: () => deleteArticle(article.slug), // Add a confirmation handler
    });
  };
  const handleUpdate = (article) => {
    navigate("/blog-update", { state: { slug: article.slug } });
  };

  const handlePageChange = (page) => {
    if (page === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (page === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (typeof page === "number") {
      setCurrentPage(page);
    }
    console.log("Page sélectionnée:", page);
  };

  return (
    <Layout>
      <div className="blog-container">
        <div className="blog-header">
          <h1>Notre blog</h1>
          <p>
            Découvrez ici tous mes articles ainsi que des contenus variés sur le
            développement, la tech, le sport, la culture et bien plus encore.
          </p>
          <div className="category-filters">
            {categories.map((category, index) => (
              <ButtonFilter
                key={index}
                isActive={selectedCategory === category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category} (
                {category === "Tous"
                  ? totalArticles
                  : categoryCounts[category] || 0}
                )
              </ButtonFilter>
            ))}
          </div>
        </div>

        <div className="blog-content">
          {loading ? (
            <p className="loading-text">Chargement des articles...</p>
          ) : (
            <div className="articles-grid">
              {displayedArticles.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  image={post.image}
                  category={post.category}
                  author={post.author}
                  slug={post.slug}
                  date={post.date}
                  content={post.content}
                  sections={post.sections}
                  protectedPost={post.protectedPost}
                  link={`/blog-post`}
                  onEdit={() => handleUpdate(post)}
                  onDelete={handleDeleteRequest} // Utiliser handleDeleteRequest pour afficher l'alerte
                />
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              <FaAngleLeft />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-number ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
        {alertMessage && (
          <Alert
            message={alertMessage.message}
            type={alertMessage.type}
            duration={alertMessage.duration}
            visible={Boolean(alertMessage)} // On passe visible en fonction de l'état
            onClose={() => setAlertMessage(null)} // On remet alertMessage à null
            onConfirm={alertMessage.onConfirm}
          />
        )}
      </div>
    </Layout>
  );
};

export default AllArticles;
