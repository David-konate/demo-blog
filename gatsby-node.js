exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /firebase/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    // Validate that the anonymize option is defined by the user and is a boolean
    anonymize: Joi.boolean().required(),
  });
};

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Md implements Node {
      frontmatter: Frontmatter
    }

    type Frontmatter {
      category: String
      image: String
    }
  `;
  createTypes(typeDefs);
};
