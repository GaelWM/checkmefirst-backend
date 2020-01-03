const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
	name: { type: String, required: true, minLength: 5, maxLength: 50 },
	email: { type: String, unique: true },
	password: { type: String, minLength: 6 },
	isAdmin: { type: Boolean }
});

userSchema.methods.getAuthentificationToken = function() {
	return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

const getUsers = async () => {
	return await User.find().sort('name');
};

const getUserById = async (id) => {
	return await User.findById({ _id: id });
};

const getUserByIdExcludePassword = async (id) => {
	return await User.findById({ _id: id }).select('-password');
};

const getUser = async (obj) => {
	return await User.findOne(obj);
};

const createUser = async (data) => {
	//console.log(data);
	const user = new User({
		name: data.name,
		email: data.email,
		password: data.password
	});

	try {
		const salt = bcrypt.genSaltSync(10);
		user.password = bcrypt.hashSync(data.password, salt);
		await user.save();
	} catch (error) {
		console.log(error);
	}

	return user;
};

const updateUser = async (id, data) => {
	return await User.findOneAndUpdate(
		id,
		{
			$set: {
				name: data.name,
				email: data.email,
				password: data.password
			}
		},
		{ new: true }
	);
};

const deleteUser = async (id) => {
	return await User.findByIdAndDelete(id);
};

const validateUser = (user) => {
	const schema = {
		name: Joi.string().min(3).required(),
		email: Joi.string().min(3).max(255).email().required(),
		password: Joi.string().min(6).max(255).required()
	};

	return Joi.validate(user, schema);
};

const validateForLogin = (user) => {
	const schema = {
		email: Joi.string().email().required(),
		password: Joi.string().required()
	};

	return Joi.validate(user, schema);
};

module.exports.validate = validateUser;
module.exports.validateForLogin = validateForLogin;
module.exports.User = User;
module.exports.userModel = {
	getUsers,
	getUser,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getUserByIdExcludePassword,
	userSchema
};
