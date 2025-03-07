import React, { useEffect, useState } from "react";
import useArticles from "../../services/articleService";
import useCategories from "../../services/categoryService";
import AtomSpinner from "../components/Spinner";
import BlogCard from "../components/BlogCard";
import "../../styles/articles.css";
import useAuth from "../../services/authService";

const AllArticles = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const { category, setCategory, categories, getCategories } = useCategories();
  const { articles, loading, fetchArticles, totalPages } = useArticles();
  const { user } = useAuth();
  const limit = 6; // Limite défini à 6 articles par page

  useEffect(() => {
    console.log("Chargement des catégories...");
    getCategories();
  }, []); // Charger les catégories une seule fois

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("Mise à jour de searchQuery:", tempSearchQuery);
      setSearchQuery(tempSearchQuery);
    }, 500);
    return () => clearTimeout(timeoutId); // Annuler l'effet précédent si le texte change avant la fin du délai
  }, [tempSearchQuery]);

  useEffect(() => {
    if (user.role === "admin") {
      // Récupérer les articles avec les filtres et la limite
      fetchArticles(page, category, searchQuery, "", limit);
    } else {
      // Récupérer les articles avec les filtres et la limite
      fetchArticles(page, category, searchQuery, user.id, limit);
    }
  }, [page, category, searchQuery]); // S'assurer que fetchArticles est déclenché lors du changement des filtres

  if (loading) {
    return <AtomSpinner />;
  }

  if (!articles) {
    return <div>Aucun article trouvé.</div>;
  }
  if (articles.length === 0) {
    return (
      <div>
        {" "}
        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par titre..."
            value={tempSearchQuery}
            onChange={(e) => {
              console.log("TempSearchQuery mis à jour:", e.target.value);
              setTempSearchQuery(e.target.value);
            }}
          />

          <select
            className="category-filter"
            value={category || ""}
            onChange={(e) => {
              console.log("Catégorie sélectionnée:", e.target.value);
              setCategory(e.target.value || null);
            }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label_category}
              </option>
            ))}
          </select>
        </div>
        <div>Aucun article trouvé.</div>
      </div>
    );
  }
  return (
    <div>
      {/* Barre de recherche et filtrage */}
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par titre..."
          value={tempSearchQuery}
          onChange={(e) => {
            console.log("TempSearchQuery mis à jour:", e.target.value);
            setTempSearchQuery(e.target.value);
          }}
        />

        <select
          className="category-filter"
          value={category || ""}
          onChange={(e) => {
            console.log("Catégorie sélectionnée:", e.target.value);
            setCategory(e.target.value || null);
          }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label_category}
            </option>
          ))}
        </select>
      </div>

      {/* Affichage des articles en grille (9 par ligne) */}
      <div
        className="articles-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {articles.map((article) => {
          const categoryLabel = categories.find(
            (c) => c.id === parseInt(article.category, 10)
          )?.label_category;

          console.log("Article affiché:", article);

          return (
            <BlogCard
              key={article.slug}
              title={article.title}
              image={article.image}
              category={categoryLabel}
              author={article.author}
              slug={article.slug}
              date={article.date}
              content={article.content}
              link={`updateArticle`}
            />
          );
        })}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="btn-pagination"
          disabled={page === 1}
          onClick={() => {
            console.log("Page précédente");
            setPage((prev) => Math.max(1, prev - 1));
          }}
        >
          Précédent
        </button>
        <span className="pagination-info">
          Page {page} / {totalPages || 1}
        </span>
        <button
          className="btn-pagination"
          disabled={page >= totalPages}
          onClick={() => {
            console.log("Page suivante");
            setPage((prev) => Math.min(totalPages, prev + 1));
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default AllArticles;
