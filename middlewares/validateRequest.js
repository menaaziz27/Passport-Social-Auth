const { ApiError } = require('../utils/ApiError');

exports.validateRequest = schema => {
	return function (req, res, next) {
		const { error } = schema.validate(req.body);
		if (error) {
			throw new ApiError(error.details[0].message, 422);
		}
		next();
	};
};
