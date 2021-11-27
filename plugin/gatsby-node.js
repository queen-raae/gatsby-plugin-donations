// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/

exports.onPreInit = (_, options) => {
  const { api_key } = options;
  process.env.api_key = api_key;
};

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    option1: Joi.string()
      .valid("unicorn", "pirate")
      .default("unicorn")
      .description(`Plugin option 1`),
  });
};
