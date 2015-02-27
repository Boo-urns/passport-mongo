var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;
var bcrypt	 = require('bcrypt-nodejs');

// The main email in the schema is 
// what we'll be searching to update the others.

// TODO - If Facebook or Google email is different it would currently be different users.
// 			- Need to lookup user.email to see if any one of googles or facebooks email matches

var UserSchema = new Schema({
	email: { type: String, index: { unique: true} },

	local: {
						email			: { type: String },
						password	: { type: String }
					},

	google: {
						id 				: { type: String },
						token			: { type: String },
						name 			: { type: String },
						email 		: { type: String }
					},

	facebook: {
						id 				: { type: String },
						token			: { type: String },
						name 			: { type: String },
						email 		: { type: String }
					},

	registered: { type: Date, default: Date.now }

});


// return the model
module.exports = mongoose.model('User', UserSchema);