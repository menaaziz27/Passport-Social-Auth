const Joi = require('joi');

exports.loginSchema = Joi.object().keys({
	email: Joi.string().trim().email().required(),
	password: Joi.string().trim().min(6).max(20).required(),
});
