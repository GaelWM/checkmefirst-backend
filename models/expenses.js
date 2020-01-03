const Joi = require('joi');
const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		maxLength: 100
	},
	description: {
		type: String,
		minLenght: 5,
		maxLength: 255
	},
	isActive: {
		type: Boolean
	},
	createdAt: {
		type: Date
	}
});

const Expense = mongoose.model('Expense', expenseSchema);

const getAll = async () => {
	return await Expense.find().sort('name');
};

const getOne = async (id) => {
	return await Expense.findById(id);
};

const store = async (data) => {
	const expense = new Expense({
		name: data.name,
		description: data.description,
		isActive: data.isActive,
		createdAt: '20200104'
	});

	await expense.save();
	return expense;
};

const update = async (data) => {
	return await Expense.findById(id);
};

const validateExpense = (expense) => {
	const schema = {
		name: Joi.string().max(255).required()
	};

	return Joi.validate(expense, schema);
};

module.exports.Expense = Expense;
module.exports.validateExpense = validateExpense;
module.exports.expenseModel = {
	getAll,
	getOne,
	store,
	update
};
