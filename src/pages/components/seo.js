// import React from "react";
// import { useSiteMetadata } from "../hooks/use-site-metadata";

// export const SEO = ({ title, description, lang, children }) => {
//   const {
//     title: defaultTitle,
//     description: defaultDescription,
//     lang: defaultLang,
//   } = useSiteMetadata();

//   const seo = {
//     title: title || defaultTitle,
//     description: description || defaultDescription,
//     lang: lang || defaultLang,
//   };

//   return (
//     <>
//       <title>{seo.title}</title>
//       <meta name="description" content={seo.description} />
//       <meta lang={seo.lang} />
//       <meta name="robots" content="index"></meta>
//       {children}
//     </>
//   );
// };
import React from "react";
import useArticles from "../../services/articleService";

export const SEO = ({ title, description, lang, children, slug }) => {
  const { articles } = useArticles();

  // Trouver l'article correspondant au slug si fourni
  const currentArticle = articles.find((article) => article.slug === slug);

  const seo = {
    title: title || currentArticle?.title || "Titre par défaut",
    description:
      description || currentArticle?.description || "Description par défaut",
    lang: lang || "fr", // Mettre une langue par défaut si non fournie
  };

  return (
    <>
      <html lang={seo.lang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="article" />
      {children}
    </>
  );
};
