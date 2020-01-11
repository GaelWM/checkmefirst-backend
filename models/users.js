const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
	name: { type: String, required: true, maxLength: 100 },
	surname: { type: String, required: true, maxLength: 100 },
	email: { type: String },
	password: { type: String, minLength: 6 },
	isAdmin: { type: Boolean }
});

userSchema.methods.getAuthentificationToken = function () {
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
	const user = new User({
		name: data.name,
		surname: data.surname,
		email: data.email,
		password: data.password,
		isAdmin: data.isAdmin
	});

	try {
		const salt = bcrypt.genSaltSync(10);
		user.password = bcrypt.hashSync(data.password, salt);
		await user.save();
	} catch (error) {
		winston.error(error);
	}

	return user;
};

const updateUser = async (id, data) => {

	//Hasing the password
	try {
		const salt = bcrypt.genSaltSync(10);
		data.password = bcrypt.hashSync(data.password, salt);
	} catch (error) {
		winston.error(error);
	}

	return await User.findOneAndUpdate(
		id,
		{
			$set: {
				name: data.name,
				surname: data.surname,
				email: data.email,
				password: data.password,
				isAdmin: data.isAdmin
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
		name: Joi.string().max(100).required(),
		surname: Joi.string().max(100).required(),
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
