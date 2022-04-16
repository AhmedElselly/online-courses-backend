const Enrol = require('../models/enrollment');

module.exports = {
	getEnrollmentById(req, res, next, id){
		Enrol.findById(id)
		.populate('student', '-password')
		.populate({path: 'course', populate: {path: 'instructor'}})
		.populate({path: 'course', populate: {path: 'lessons'}})
		.exec((err, enrol) => {
			if(err) return res.status(400).json({error: 'Could not find enrollment for this ID'});
			req.enrol = enrol;
			req.enrol.course.image = undefined;
			req.enrol.course.instructor.password = undefined;
			next();
		});
	},

	async findEnrollment(req, res, next){
		const found = await Enrol.find({course: req.course._id, student: req.user._id});
		if(!found.length){
			next();
		} else {
			return res.json({message: 'You already enrolled to this course'});
		}
	},

	async create(req, res){
		const newEnrol = {
			course: req.course,
			student: req.user
		}
		req.course.image = undefined;

		newEnrol.lessonsStatus = req.course.lessons.map(lesson => {
			return {lesson, complete: false}
		});

		const enrol = await new Enrol(newEnrol);

		enrol.save((err, enrol) => {
			if(err) return res.status(400).json({err});
			return res.json(enrol);
		})
	},

	async read(req, res){
		const enrol = await Enrol.findById(req.enrol._id)
		.populate('student', '-password')
		.populate({path: 'course', populate: {path: 'instructor'}})
		.populate({path: 'course', populate: {path: 'lessons'}})
		.populate('lessonsStatus.lesson');
		
		enrol.course.image = undefined;
		return res.json(enrol);
	},

	async listByStudent(req, res){
		const enrol = await Enrol.find({'student': req.user._id})
			.populate({path: 'course', populate: {path: 'lessons'}})
			.populate('student').populate('instructor').populate('course', '-image');
		return res.json(enrol)
	},

	async complete(req, res){
		let updatedData = {};
		updatedData['lessonsStatus.$.complete'] = req.body.updatedData.complete;
		updatedData.update = Date.now();
		if(req.body.updatedData.courseCompleted){
			updatedData.completed = req.body.updatedData.courseCompleted;
		}
		let enrol = await Enrol.updateOne({'lessonsStatus._id': req.body.updatedData.lessonStatusId}, {'$set': updatedData});
		return res.json(enrol);
	},

	async enrollmentStats(req, res){
		let stats = {};
		stats.totalEnrolled = await Enrol.find({course: req.course._id}).countDocuments();
		stats.totalCompleted = await Enrol.find({course: req.course._id})
			.exists('completed', true)
			.countDocuments();
		return res.json(stats);
	}
}