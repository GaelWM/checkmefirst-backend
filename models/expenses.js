const Joi = require('joi');
const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxLength: 100
	},
	description: {
		type: String,
		minLength: 5,
		maxLength: 255,
		nullable: true
	},
	isActive: {
		type: Boolean,
		default: true
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
		createdAt: Date.now()
	});

	await expense.save();
	return expense;
};

const update = async (data) => {
	return await Expense.findById(id);
};

function validateExpense(expense) {
	const schema = {
		name: Joi.string().max(255).required(),
		description: Joi.string().max(255),
		isActive: Joi.boolean()
	};

	return Joi.validate(expense, schema);
}

module.exports.Expense = Expense;
module.exports.validateExpense = validateExpense;
module.exports.expenseModel = {
	getAll,
	getOne,
	store,
	update
};
