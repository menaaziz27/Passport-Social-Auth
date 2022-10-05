const Joi = require('joi');

exports.registerSchema = Joi.object().keys({
	name: Joi.string().trim().alphanum().max(30).min(2).required(),
	email: Joi.string().trim().email().required(),
	password: Joi.string().trim().min(6).max(20).required(),
});
