const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
	getUserById(req, res, next, id){
		User.findById(id).exec(function(err, user){
			if(err) return res.status({error: 'No user with that ID'});
			req.user = user;
			next();
		});
	},

	async register(req, res){
		const user = await new User(req.body);
		user.save((err, user) => {
			if(err) return res.status(400).json({err});
			return res.json(user);
		});
	},

	async login(req, res){
		const user = await User.findOne({email: req.body.email});

		const token = await jwt.sign({_id: user._id, email: user.email, teacher: user.teacher, fullName: user.fullName}, process.env.SECRETKEY);
		user.comparePassword(req.body.password);
		res.cookie('t', token, {expire: new Date() + 9999});
		return res.json({token, user});
	},

	logout(req, res){
		res.clearCookie('t');
        res.json({message: 'Signout Success'});
	}
}