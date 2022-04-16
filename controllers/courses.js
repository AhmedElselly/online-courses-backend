const Course = require('../models/course');
const Lesson = require('../models/lesson');

module.exports = {
	getCourseById(req, res, next, id){
		Course.findById(id).populate('instructor', '-password').populate('lessons').exec((err, course) => {
			if(err) return res.status(400).json({error: 'Could not find course with that ID'});
			req.course = course;
			next();
		})
	},

	async create(req, res){
		const course = await new Course(req.body);
		course.instructor = req.user;

		if(req.file){
			course.image.data = req.file.buffer;
			course.image.contentType = req.file.mimetype;
		}

		course.save((err, course) => {
			if(err) return res.status(400).json({err});
			return res.json(course);
		});
	},

	async updateCourse(req, res){
		const course = await req.course;
		console.log(req.file)
		course.name = req.body.name;
		course.description = req.body.description;
		course.category = req.body.category;

		// updateLessons(req.body, req.body.index);

		if(req.file){
			course.image.data = req.file.buffer;
			course.image.contentType = req.file.mimetype;
		}

		course.save((err, course) => {
			if(err) return res.status(400).json({err});
			return res.json(course);
		})
	},

	async courseIndex(req, res){
		const courses = await Course.find().populate('instructor').select('-image');
		return res.json(courses);
	},

	async getPublishedCourses(req, res){
		const courses = await Course.find({published: true})
		.populate('lessons')
		.populate('instructor', '-password').select('-image');
		return res.json(courses);
	},

	async courseByUser(req, res){
		const courses = await Course.find({'instructor': req.user});
		return res.json(courses);
	},

	async courseShow(req, res){
		const course = await req.course;
		course.image = undefined;
		return res.json(course);
	},

	courseImage(req, res){
		res.set('Content-Type', req.course.image.contentType);
		return res.send(req.course.image.data);
	},

	// Creating lessons
	async createLessons(req, res){
		const lesson = await new Lesson(req.body);
		lesson.save();
		const course = await Course.findByIdAndUpdate({_id: req.course._id}, {$push: {lessons: lesson}});
		return res.json(lesson);
		
	},

	async updateLesson(req, res){
		// updateLessons(req, res, req.body.index);
		const course = await req.course;
		let {index, title, content, resource_url} = req.body;
		course.lessons[index].title = title;
		course.lessons[index].content = content;
		course.lessons[index].resource_url = resource_url;
		console.log(course);
		course.lessons[index].save();
		course.save((err, course) => {
			if(err) return res.status(400).json({err});
			return res.json(course);
		});
	},

	async publish(req, res){
		const course = await req.course;
		console.log(req.body)
		course.published = req.body.published;
		course.save((err, course) => {
			if(err) return res.status(400).json({err});
			return res.json(course);
		})
	},

	async search(req, res){
		const query = {};
		console.log(req.query)
		if(req.query.name){
			query.name = {$regex: req.query.name, $options: 'i'};
		}	
		const course = await Course.find(query)
			.populate('instructor', '-password')
			.populate('lessons').select('-image');
		return res.json(course);

	}
}
