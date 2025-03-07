import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import ReactMde from "react-mde";
import MarkdownInfo from "./markdownInfo";
import { useArticleContext } from "../../context/use-article-context";
import useArticles from "../../services/articleService";
import Spinner from "./Spinner";
import validationSchema from "../../utils/validationSchema";
import useCategories from "../../services/categoryService";

const CreatePost = () => {
  const { setArticlePreview } = useArticleContext();
  const { categories, getCategories } = useCategories();
  const { saveArticle, loading } = useArticles();
  const [selectedTab, setSelectedTab] = useState("write");

  const [markdown, setMarkdown] = useState("");
  const [formValues, setFormValues] = useState({
    title: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    slug: "",
    image: "",
  });

  useEffect(() => {
    getCategories();
    setArticlePreview({
      ...formValues,
      content: markdown,
    });
  }, [formValues, markdown, setArticlePreview]);

  Showdown.extension("center-images", function () {
    return [
      {
        type: "output",
        regex: /<img(.*?)>/g,
        replace: `<div style="text-align: center;"><img $1 style="max-width:100%; height:auto; max-height:400px;" /></div>`,
      },
    ];
  });

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

  const customCommandSectionOpen = {
    name: "my-custom-command-section-open",
    icon: () => (
      <span role="img" aria-label="Section Open">
        <strong>&lt;section&gt;</strong>
      </span>
    ),
    execute: (opts) => {
      // Insérer <section> au début de la sélection
      opts.textApi.replaceSelection("<section>");
    },
  };

  const customCommandSectionClose = {
    name: "my-custom-command-section-close",
    icon: () => (
      <span role="img" aria-label="Section Close">
        <strong>&lt;/section&gt;</strong>
      </span>
    ),
    execute: (opts) => {
      // Insérer </section> à la fin de la sélection
      opts.textApi.replaceSelection("</section>");
    },
  };

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    extensions: ["center-images"],
    simpleLineBreaks: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  const generateSlug = (title) => {
    return title
      .normalize("NFD") // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Remplace tout ce qui n'est pas alphanumérique par "-"
      .replace(/^-+|-+$/g, "") // Supprime les tirets en début et fin
      .substring(0, 50);
  };

  return (
    <div className="blog-creator-container">
      {loading ? (
        <p>
          <Spinner />
        </p>
      ) : (
        <div>
          <h1 className="blog-creator-title">Créer un article pour le blog</h1>
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Article soumis :", values, markdown);
              saveArticle({ ...values, content: markdown, setLoading: true });
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
                        slug: generateSlug(value),
                      }));
                    }}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error"
                  />

                  <ErrorMessage
                    name="author"
                    component="div"
                    className="error"
                  />
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
                      const selectedCategoryId = e.target.value;
                      setFieldValue("category", selectedCategoryId);
                      setFormValues((prev) => ({
                        ...prev,
                        category: selectedCategoryId,
                      }));
                    }}
                  >
                    <option value="">Sélectionner une catégorie</option>{" "}
                    {/* Option vide au départ */}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label_category}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="error"
                  />
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
                  <div className="label-container-create-post">
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
                      sectionOpen: customCommandSectionOpen, // Commande pour <section>
                      sectionClose: customCommandSectionClose, // Commande pour </section>
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
                        "sectionOpen", // Ajouter le bouton pour <section>
                        "sectionClose", // Ajouter le bouton pour </section>
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
                    Publier
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
