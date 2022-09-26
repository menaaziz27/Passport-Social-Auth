const { ApiError } = require('../utils/ApiError');

const notFound = (req, res, next) => {
	const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
	next(error);
};

const errorHandler = (error, req, res, next) => {
	let { statusCode, message, stack } = error;
	statusCode = statusCode || 500;
	res.status(statusCode).json({
		status: 'error',
		statusCode: statusCode,
		message: message || 'Internal Server Error',
		...(process.env.NODE_ENV !== 'production' && { stack }),
	});
};

module.exports = { errorHandler, notFound };
