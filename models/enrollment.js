const mongoose = require('mongoose');
const {Schema} = mongoose;

const enrollmentSchema = new Schema({
	course: {
		type: Schema.Types.ObjectId,
		ref: 'Course'
	},

	student: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	lessonsStatus: [
		{
			lesson: {
				type: Schema.Types.ObjectId,
				ref: 'Lesson'
			},
			complete: Boolean
		}
	],

	enrolledAt: {
		type: Date,
		default: Date.now
	},

	completed: Date,
	
});

module.exports = mongoose.model('Enrol', enrollmentSchema);