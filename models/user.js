const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	teacher: {
		type: Boolean,
		default: false
	},
	fullName: String
});

userSchema.pre('save', async function(next){
	this.password = await bcrypt.hashSync(this.password, 10);
	this.fullName = `${this.firstName} ${this.lastName}`;
	next()
});

userSchema.methods = {
	comparePassword(password){
		return bcrypt.compareSync(this.password, password);
	}
}

module.exports = mongoose.model('User', userSchema);