const mongoose = require('mongoose');
const {Schema} = mongoose;

const lessonSchema = new Schema({
	title: String,
	content: String,
	resource_url: String
});

module.exports = mongoose.model('Lesson', lessonSchema);