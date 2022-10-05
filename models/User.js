const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
	{
		name: String,
		email: String,
		password: String,
		username: String,
		provider: {
			type: String,
			required: true,
		},
		avatar: String,
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function () {
	const token = jwt.sign(
		{
			expiresIn: '12h',
			id: this._id,
			email: this.email,
		},
		secretOrKey
	);
	return token;
};

const User = model('User', userSchema);

module.exports = User;
