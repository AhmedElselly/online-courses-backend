require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expenses-tracker', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log('connected to database');
});

const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.use('/enrollments', enrollmentRoutes);
app.use('/courses', courseRoutes);
app.use('/', userRoutes);


app.listen(PORT, function(){
	console.log(`Server is on port ${PORT}`);
});