var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;
var bcrypt	 = require('bcrypt-nodejs');


var UserSchema = new Schema({

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