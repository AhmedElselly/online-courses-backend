const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const {
	isAuth,
	isOwner,
	isEducator
} = require('../middlewares');

const {
	create,
	courseIndex,
	getCourseById,
	courseImage,
	courseShow,
	courseByUser,
	createLessons,
	updateCourse,
	updateLesson,
	publish,
	getPublishedCourses,
	search
} = require('../controllers/courses');

const {
	getUserById
} = require('../controllers/users');

/* FOR TESTING MIDDLEWARES*/
// router.get('/test', isAuth, isEducator, (req, res) => {
// 	try{
// 		return res.json({message: 'middleware working'})
// 	} catch(err){
// 		return res.json({error: 'user is not teacher'})
// 	}
// })
router.get('/search', search);

router.get('/', courseIndex);
router.get('/published', getPublishedCourses);
router.get('/:courseId/image', courseImage);
router.get('/:courseId', isAuth, isEducator, courseShow);
router.get('/:courseId/:userId', isAuth, isEducator, courseByUser);
router.put('/new/lesson/:courseId/:userId', isAuth, isEducator, isOwner, createLessons);
router.put('/update/:courseId/:userId', isAuth, isEducator, isOwner, upload.single('image'), updateCourse);
router.put('/publish/:courseId/:userId', isAuth, isEducator, isOwner, publish);
router.put('/update/:courseId/:userId/lesson', isAuth, isEducator, isOwner, updateLesson);
router.post('/new/:userId', isAuth, isEducator, upload.single('image'), create);


router.param('userId', getUserById);
router.param('courseId', getCourseById);

module.exports = router;