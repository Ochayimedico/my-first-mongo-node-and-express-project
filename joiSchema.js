const Joi = require("joi");

module.exports.productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required().min(1).max(10),
  category: Joi.required(),
});
