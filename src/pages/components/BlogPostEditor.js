import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import ReactMde from "react-mde";
import MarkdownInfo from "./markdownInfo";
import { useArticleContext } from "../../context/use-article-context";
import useArticles from "../../services/articleService";

const BlogPostEditor = ({ slug }) => {
  const { updateArticle, setArticlePreview, fetchArticleBySlug, article } =
    useArticleContext();
  const [selectedTab, setSelectedTab] = useState("write");
  const [formValues, setFormValues] = useState({
    title: "",
    author: "",
    date: "",
    category: "",
    slug: "",
    image: "",
  });
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (slug) {
      fetchArticleBySlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (article) {
      setFormValues({
        title: article.title,
        author: article.author,
        date: article.date,
        category: article.category,
        slug: article.slug,
        image: article.image || "",
      });
      setMarkdown(article.content || "");
    }
  }, [article]);

  useEffect(() => {
    setArticlePreview({
      ...formValues,
      content: markdown,
    });
  }, [formValues, markdown, setArticlePreview]);

  const customCommand = {
    name: "my-custom-command-indentation",
    icon: () => (
      <span role="img" aria-label="tabulation">
        <strong>--&gt;|</strong>
      </span>
    ),
    execute: (opts) => {
      opts.textApi.replaceSelection("&nbsp;&nbsp;&nbsp;&nbsp;");
    },
  };
  const customCommandH4 = {
    name: "my-custom-command-h4",
    icon: () => (
      <span role="img" aria-label="H4">
        <strong>H2</strong>
      </span>
    ),
    execute: (opts) => {
      opts.textApi.replaceSelection("#### ");
    },
  };

  const customCommandH5 = {
    name: "my-custom-command-h5",
    icon: () => (
      <span role="img" aria-label="H5">
        <strong>H3</strong>
      </span>
    ),
    execute: (opts) => {
      opts.textApi.replaceSelection("##### ");
    },
  };

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    simpleLineBreaks: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <div className="blog-creator-container">
      <h1 className="blog-creator-title">Créer un article pour le blog</h1>

      <Formik
        initialValues={formValues}
        validationSchema={Yup.object({
          title: Yup.string()
            .required("Titre requis")
            .max(50, "Le titre ne doit pas dépasser 50 caractères"),
          author: Yup.string().required("Auteur requis"),
          date: Yup.string().required("Date requise"),
          category: Yup.string().required("Catégorie requise"),
          slug: Yup.string().required("Slug requis"),
        })}
        onSubmit={(values) => {
          console.log("Article soumis :", values, markdown);
          updateArticle({ ...values, content: markdown, slug: article.slug });
        }}
        enableReinitialize
        validateOnBlur={true}
        validateOnChange={true}
      >
        {({ setFieldValue, values, errors, touched, setTouched }) => (
          <Form
            className="blog-form"
            onChange={(e) => {
              const { name, value } = e.target;
              setFieldValue(name, value);
              setTouched({ title: true });
              setFormValues((prev) => ({
                ...prev,
                [name]: value,
              }));
            }}
          >
            {console.log("Erreurs du formulaire :", errors, touched)}
            <div className="form-group">
              <label>Titre</label>
              <Field
                name="title"
                type="text"
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("title", value);
                  setFormValues((prev) => ({
                    ...prev,
                    title: value,
                  }));
                }}
              />
              <ErrorMessage name="title" component="div" className="error" />
              <label>Auteur</label>
              <Field
                name="author"
                type="text"
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("author", value);
                  setFormValues((prev) => ({
                    ...prev,
                    author: value,
                  }));
                }}
              />
              <ErrorMessage name="author" component="div" className="error" />
              <label>Date</label>
              <Field
                name="date"
                type="date"
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("date", value);
                  setFormValues((prev) => ({
                    ...prev,
                    date: value,
                  }));
                }}
              />
              <ErrorMessage name="date" component="div" className="error" />
              <label>Catégorie</label>
              <Field
                as="select"
                name="category"
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("category", value);
                  setFormValues((prev) => ({
                    ...prev,
                    category: value,
                  }));
                }}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Moi">Moi & Mon Parcours</option>
                <option value="Projets">Mes Projets & Développement</option>
                <option value="Geek">Livres, BD & Culture Geek</option>
                <option value="Series">Films & Séries</option>
                <option value="Sports">Sport & Bien-être</option>
                <option value="Inspirations">
                  Mes Inspirations & Motivations
                </option>
                <option value="Conseils">
                  Conseils & Retours d’Expérience
                </option>
              </Field>
              <ErrorMessage name="category" component="div" className="error" />
              <label>Image Principale</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setFieldValue("image", imageUrl);
                    setFormValues((prev) => ({
                      ...prev,
                      image: imageUrl,
                    }));
                  }
                }}
              />
              <ErrorMessage name="image" component="div" />
              {values.image && (
                <div className="image-preview">
                  <img
                    src={values.image}
                    alt="Aperçu"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </div>
              )}
              <div className="label-container">
                <label>Contenu</label>
                <MarkdownInfo />
              </div>

              <ReactMde
                value={markdown}
                onChange={setMarkdown}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                disablePreview={true}
                commands={{
                  h4: customCommandH4,
                  indentation: customCommand,

                  h5: customCommandH5,
                }}
                toolbarCommands={[
                  [
                    "header",
                    "h4",
                    "h5",
                    "indentation",
                    "bold",
                    "italic",
                    "image",
                  ],
                ]}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
              <button
                type="submit"
                className="btn"
                style={{ marginTop: "1rem" }}
              >
                Modifier
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BlogPostEditor;
