import React, { useState, useEffect } from "react";

import BlogCard from "../components/blogCard";
import styled from "styled-components";
import background from "../../images/background.png";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import useArticles from "../../services/articleService";

//Ads

export function useMedia(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

const AllArticles = () => {
  const { articles, fetchArticles } = useArticles();
  const articlesData = articles || []; // Assure-toi que articles est toujours un tableau

  const isPhone = useMedia("(max-width: 767px)");
  const isLaptop = useMedia("(min-width: 1225px)");

  // Récupérer toutes les catégories des articles (pour éviter les répétitions)
  const categories = [
    "Tous",
    ...new Set(articlesData.map((article) => article.category)),
  ];

  useEffect(() => {
    fetchArticles(); // Appelle la fonction pour récupérer les articles
  }, []);

  // Ajout de l'état pour la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3; // Nombre d'articles par page

  // Filtrer les articles en fonction de la catégorie sélectionnée
  const filteredArticles =
    selectedCategory && selectedCategory !== "Tous"
      ? articlesData.filter((article) => article.category === selectedCategory)
      : articlesData;

  const categoryCounts = articlesData.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {});

  // Calculer la plage d'articles à afficher après filtrage
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const newPage =
        direction === "next"
          ? Math.min(
              prevPage + 1,
              Math.ceil(filteredArticles.length / articlesPerPage)
            )
          : Math.max(prevPage - 1, 1);
      return newPage;
    });
  };

  // Code de ton composant

  const ButtonFilter = styled.p`
    color: black;
    font-weight: 500;
    font-size: 14px;
    background: white;
    min-width: 82px;
    margin-left: 6px;
    margin-right: 6px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 36px;
    padding: 0px 15px;
    :hover {
      cursor: pointer;
      background: #aa6280;
      color: white;
    }
  `;

  const styles = {
    container: {
      margin: 0,
      padding: 0,
      fontFamily: "Montserrat",
    },
    background: {
      display: "flex",
      flexDirection: "column",
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(180deg, rgba(216,94,75, 0.8),
      rgba(161,84,119, 0.8)),url(${background})`,
      height: "650px",
      marginTop: 73,
      padding: "145px 0px 0px 0px",
      alignItems: "center",
    },
    searchInput: {
      fontFamily: "Montserrat",
      width: isPhone ? "70%" : 400,
      outlineColor: "rgba(252, 206, 192, 1)",
      border: "none",
      borderRadius: "5px 0px 0px 5px",
      height: 45,
      padding: 21,
      fontSize: "16px",
      fontWeight: 400,
    },
    divider: {
      border: "1px solid #E0E0E0",
      width: !isLaptop ? "100%" : "100%",
      marginBottom: 16,
    },
    categoriesName: {
      fontSize: "16px",
      fontWeight: 400,
      color: "black",
      marginBottom: 16,
    },
    categoriesNbr: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#F56D44",
      marginBottom: 16,
    },
  };

  return (
    <div style={styles.container}>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>

      {/* BACKGROUND */}
      <div style={styles.background}>
        <h1
          style={{
            fontWeight: "800",
            fontSize: "58px",
            color: "white",
            marginBottom: 15,
          }}
        >
          Notre blog
        </h1>
        <p
          style={{
            fontWeight: "400",
            fontSize: "14px",
            color: "white",
            textAlign: "center",
            width: "80%",
            marginBottom: 35,
          }}
        >
          Retrouvez ici l'intégralité de nos blogs.
        </p>

        {isPhone ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 35,
              }}
            >
              {categories.slice(0, 3).map((category, index) => (
                <a
                  key={index}
                  href={`#${category.toLowerCase()}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <ButtonFilter>{category}</ButtonFilter>
                </a>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 35,
              }}
            >
              {categories
                .slice(categories.length - 2)
                .map((category, index) => (
                  <a
                    key={index}
                    href={`#${category.toLowerCase()}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <ButtonFilter>{category}</ButtonFilter>
                  </a>
                ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 35,
            }}
          >
            {categories.map((category, index) => (
              <a
                key={index}
                href={`#${category.toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
              >
                <ButtonFilter>{category}</ButtonFilter>
              </a>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          paddingRight: isPhone ? 30 : 100,
          paddingLeft: isPhone ? 30 : 100,
          paddingBottom: 55,
          paddingTop: 64,
          display: "flex",
          flexDirection: isLaptop ? "row" : "column",
          justifyContent: "space-between",
          marginBottom: 70,
        }}
      >
        {!isLaptop && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 75,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "black",
                  marginBottom: 45,
                }}
              >
                Catégorie
              </p>
              {categories.map((category) => (
                <div
                  key={category}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <a
                    href={`#${category.toLowerCase()}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <p style={styles.categoriesName}>{category}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {currentArticles.map((post) => (
            <BlogCard
              title={post.title}
              image={post.image}
              category={post.category}
              author={post.author}
              slug={post.slug}
              date={post.date}
              content={post.content} // Utiliser le contenu HTML généré par `marked`
              sections={post.sections} // Passer les sections extraites à `BlogCard`
              link={post.slug}
            />
          ))}
        </div>
        {isLaptop && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "35%",
              marginLeft: 70,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "black",
                  marginBottom: 45,
                }}
              >
                Catégorie
              </p>
              {categories.map((category, index) => (
                <div>
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span style={styles.categoriesName}> {category}</span>
                    <span style={styles.categoriesNbr}>
                      {categoryCounts[category]}
                    </span>
                  </div>
                  <div style={styles.divider}></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 100,
          paddingLeft: isLaptop ? "20%" : 50,
          paddingRight: isLaptop ? "20%" : 50,
        }}
      >
        <ul
          style={{
            display: "flex",
            flexDirection: "column", // Ajouté pour empiler les éléments en colonne
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Bouton Page Précédente */}
            <button
              onClick={() => handlePageChange("prev")}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "20px",
                border: "none",
                cursor: currentPage === 1 ? "not-allowed" : "pointer", // Désactiver le curseur si c'est la première page
              }}
              disabled={currentPage === 1} // Désactiver si c'est la première page
            >
              <FaAngleLeft color={"#FFFFFF"} />
            </button>

            {/* Bouton Page Suivante */}
            <button
              onClick={() => handlePageChange("next")}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "20px",
                border: "none",
                cursor:
                  currentPage ===
                  Math.ceil(filteredArticles.length / articlesPerPage)
                    ? "not-allowed"
                    : "pointer", // Désactiver le curseur si c'est la dernière page
              }}
              disabled={
                currentPage ===
                Math.ceil(filteredArticles.length / articlesPerPage)
              } // Désactiver si c'est la dernière page
            >
              <FaAngleRight color={"#FFFFFF"} />
            </button>
          </div>

          {/* Compteur de Page en dessous des boutons */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p>
              Page {currentPage} sur{" "}
              {Math.ceil(filteredArticles.length / articlesPerPage)}
            </p>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default AllArticles;
