import * as Yup from "yup";
import xss from "xss";

// Fonction pour nettoyer les données et prévenir les attaques XSS
const cleanXSS = (value) => xss(value);

// Schéma de validation pour créer un article
const createArticleValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required.")
    .max(255, "Title must not exceed 255 characters.")
    .trim()
    .test(
      "clean-xss",
      "Title contains invalid characters.",
      (value) => cleanXSS(value) === value
    ),

  fileUrl: Yup.string()
    .required("File URL is required.")
    .url("File URL must be a valid URL.")
    .trim(),

  author: Yup.string()
    .required("Author is required.")
    .max(255, "Author name must not exceed 255 characters.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Author name must only contain letters and spaces."
    )
    .trim()
    .test(
      "clean-xss",
      "Author contains invalid characters.",
      (value) => cleanXSS(value) === value
    ),

  date: Yup.string()
    .required("Date is required.")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be a valid date (YYYY-MM-DD).")
    .trim(),

  categoryId: Yup.number()
    .optional()
    .integer("Category ID must be a valid integer.")
    .positive("Category ID must be a positive integer."),
});

// Schéma de validation pour mettre à jour un article
const updateArticleValidationSchema = Yup.object({
  slug: Yup.string()
    .required("Slug is required.")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must only contain lowercase letters, numbers, and hyphens."
    )
    .trim()
    .test(
      "clean-xss",
      "Slug contains invalid characters.",
      (value) => cleanXSS(value) === value
    ),

  title: Yup.string()
    .optional()
    .max(255, "Title must not exceed 255 characters.")
    .trim()
    .test(
      "clean-xss",
      "Title contains invalid characters.",
      (value) => cleanXSS(value) === value
    ),

  fileUrl: Yup.string().optional().url("File URL must be a valid URL.").trim(),

  author: Yup.string()
    .optional()
    .max(255, "Author name must not exceed 255 characters.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Author name must only contain letters and spaces."
    )
    .trim()
    .test(
      "clean-xss",
      "Author contains invalid characters.",
      (value) => cleanXSS(value) === value
    ),

  date: Yup.string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be a valid date (YYYY-MM-DD).")
    .trim(),

  protected: Yup.boolean()
    .optional()
    .test(
      "is-boolean",
      "Protected must be a boolean value.",
      (value) => typeof value === "boolean"
    ),
});

export { createArticleValidationSchema, updateArticleValidationSchema };
