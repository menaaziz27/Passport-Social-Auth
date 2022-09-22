const mongoose = require('mongoose');

exports.connectToDb = async () => {
	try {
		return await mongoose.connect('mongodb://localhost:27017/passportjs', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (e) {
		console.log(err);
	}
};
