var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;
var bcrypt	 = require('bcrypt-nodejs');

// user schema
var UserSchema = new Schema({
	firstName: String,
	username: { type: String, required: true, index: { unique: true}},
	password: { type: String, required: true },
	email: { type: String, required: true},
	registered: { type: Date, default: Date.now }
});


// return the model
module.exports = mongoose.model('User', UserSchema);

// module.exports = mongoose.model('User',{
// 	id: String,
// 	username: String,
// 	password: String,
// 	email: String,
// 	firstName: String,
// 	lastName: String
// });