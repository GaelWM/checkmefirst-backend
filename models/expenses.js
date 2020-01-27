const Joi = require('joi');
const _ = require('lodash');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { userModel } = require('./users');

const expenseSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxLength: 100,
		unique: true,
		uniqueCaseInsensitive: true
	},
	description: {
		type: String,
		minLength: 5,
		maxLength: 255,
		nullable: true
	},
	user: mongoose.Schema({
		name: { type: String, required: true, maxLength: 100 },
		surname: { type: String, required: true, maxLength: 100 },
		email: { type: String },
	}),
	isActive: {
		type: Boolean,
		default: true
	}
});

expenseSchema.plugin(uniqueValidator, {
	message: 'Error, expected {PATH} to be unique.'
});

const Expense = mongoose.model('Expense', expenseSchema);

const getExpenses = async () => {
	return await Expense.find().sort('name');
};

const getExpenseById = async (id) => {
	return await Expense.findById(id);
};

const getUserExpenses = async (userId) => {
	return await Expense.aggregate([
		{
			"let": { "exaId": "$_id" },
			$lookup:
			{
				from: "users",
				localField: "userId",
				foreignField: "_id",
				as: "user_expenses"
			},
		}
	]);
}

const getExpenseItems = async () => {
	return await Expense.aggregate([
		{
			$lookup:
			{
				from: "expenses-items",
				let: { expense_item: "$_id" },
				pipeline: [
					{
						$match:
						{
							$expr:
								{ $eq: ["$_id", "$$expense_item"] },
						}
					}
				],
				as: "expenseItems"
			}
		}
	]);
}

const createExpense = async (data, userId) => {
	const user = await userModel.getUserByIdExcludePassword(userId);
	const expense = new Expense({
		name: data.name,
		description: data.description,
		user: _.pick(user, ['_id', 'name', 'surname', 'email']),
		isActive: data.isActive
	});

	await expense.save();
	return expense;
};

const updateExpense = async (id, userId, data) => {
	const user = await userModel.getUserByIdExcludePassword(userId);
	return await Expense.findByIdAndUpdate(id, {
		name: data.name,
		description: data.description,
		user: _.pick(user, ['_id', 'name', 'surname', 'email']),
		isActive: data.isActive
	}, { new: true });
};

const deleteExpense = async (id) => {
	return await Expense.findByIdAndDelete(id);
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
	getExpenses,
	getExpenseById,
	createExpense,
	updateExpense,
	deleteExpense,
	expenseSchema,

	//Custom queries
	getUserExpenses,
	getExpenseItems,
	getUserExpenses
};
