const express = require('express');
const router = express.Router();

const {
	isAuth
} = require('../middlewares');

const {
	getCourseById
} = require('../controllers/courses');

const {
	getUserById
} = require('../controllers/users');

const {
	create,
	findEnrollment,
	getEnrollmentById,
	read,
	listByStudent,
	enrollmentStats,
	complete
} = require('../controllers/enrollments');

router.get('/stats/:courseId', isAuth, enrollmentStats);
router.get('/learn-list/:userId', isAuth, listByStudent);
router.get('/:enrolId', isAuth, read);
router.post('/new/:courseId/:userId', isAuth, findEnrollment, create);

router.put('/update-lesson-status', isAuth, complete);

router.param('courseId', getCourseById);
router.param('userId', getUserById);
router.param('enrolId', getEnrollmentById);

module.exports = router;