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

const AllArticles = () => {
  const {
    articles,
    fetchArticles,
    getArticleCountByCategory,
    categoriesCount,
    deleteArticle,
    loading,
  } = useArticles();
  const { getCategories, categories } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchArticles(
        currentPage,
        selectedCategory !== "Tous" ? selectedCategory : ""
      );
      await getArticleCountByCategory();
      await getCategories();
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

  const categoriesAll = [
    "Tous",
    ...categoriesCount.map(({ category }) => category),
  ];

  const totalPages = Math.ceil(
    (categoryCounts[selectedCategory] || articles.length || totalArticles) /
      articlesPerPage
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

  const handlePageChange = (page) => {
    if (page === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (page === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (typeof page === "number") {
      setCurrentPage(page);
    }
  };

  return loading ? (
    <Layout>
      <Spinner />
    </Layout>
  ) : (
    <Layout>
      <Helmet>
        <title>Notre Blog - Articles sur la Tech, le Sport et plus</title>
        <meta
          name="description"
          content="Découvrez une variété d'articles sur le développement, la tech, le sport, la culture et bien plus encore."
        />
        <meta
          name="keywords"
          content="blog, tech, développement, sport, culture, articles, web"
        />
        <meta name="author" content="Ton Nom" />
      </Helmet>
      <div className="blog-container">
        <div className="blog-header">
          <h1>Notre blog</h1>
          <p>
            Découvrez ici tous mes articles ainsi que des contenus variés sur le
            développement, la tech, le sport, la culture et bien plus encore.
          </p>
          <div className="category-filters">
            {categoriesAll.map((category, index) => (
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
              {displayedArticles.map((post) => {
                const categoryObj = categories.find(
                  (cat) => cat.id.toString() === post.category
                );

                return (
                  <BlogCard
                    key={post.slug}
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
