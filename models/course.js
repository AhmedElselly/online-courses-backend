const mongoose = require('mongoose');
const {Schema} = mongoose;

const courseSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	description: {
		type: String,
		trim: true,
		required: true
	},
	image: {
		data: Buffer,
		contentType: String
	},
	category: {
		type: String,
		required: true
	},
	instructor: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	lessons: [{
		type: Schema.Types.ObjectId,
		ref: 'Lesson'
	}],
	published: {
		type: Boolean,
		default: false
	},
	updated: Date,
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Course', courseSchema);