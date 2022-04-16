const jwt = require('jsonwebtoken');

module.exports = {
	async isAuth(req, res, next){
		const token = await req.headers.authorization.split(' ')[1];
		const user = await jwt.verify(token, process.env.SECRETKEY);
		req.auth = user;
		next();
	},

	async isEducator(req, res, next){
		if(req.auth.teacher){
			next();
		} else {
			throw new Error('User is not an educator');
		}
	},

	async isOwner(req, res, next){
		if(req.auth._id == req.user._id){
			console.log(req.auth._id)
			console.log(req.user._id)
			next();
		} else{
			throw new Error('User is not authenticated');
		}
	}
}