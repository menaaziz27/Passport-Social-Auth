class ApiError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.statusCode = statusCode;
		Error.captureStackTrace(this);
	}
}

module.exports = { ApiError };
