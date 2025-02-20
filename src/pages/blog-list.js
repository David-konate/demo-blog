import React, { useState, useEffect } from "react";
import BlogCard from "./components/BlogCard";
import useArticles from "../services/articleService";
import ButtonFilter from "./components/ButtonFilter";
import "../styles/list-blog.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Layout from "./components/layout";

const AllArticles = () => {
  const {
    articles,
    fetchArticles,
    getArticleCountByCategory,
    categoriesCount,
  } = useArticles();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;
  const [displayedArticles, setDisplayedArticles] = useState([]);

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

  // Mettre à jour displayedArticles dès que articles change
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
            Retrouvez ici l'intégralité de nos blogs, ainsi que les blogs de nos
            partenaires réalisés pour la communauté et les fans de basketball.
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
                  link={`/blog-post`}
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
      </div>
    </Layout>
  );
};

export default AllArticles;
