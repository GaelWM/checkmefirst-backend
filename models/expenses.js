const Joi = require('joi');
const mongoose = require('mongoose');
const { userModel } = require('./users');

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
	userId: { type: mongoose.Types.ObjectId, unique: false, required: true },
	user: mongoose.Schema({
		name: { type: String, required: true, maxLength: 100 },
		surname: { type: String, required: true, maxLength: 100 },
		email: { type: String },
		password: { type: String, minLength: 6 },
		isAdmin: { type: Boolean }
	}),
	isActive: {
		type: Boolean,
		default: true
	}
});

const Expense = mongoose.model('Expense', expenseSchema);

const getExpenses = async () => {
	return await Expense.find().sort('name');
};

const getExpenseById = async (id) => {
	return await Expense.findById(id);
};

const getUserExpenses = async () => {
	return await Expense.aggregate([
		{
			$lookup:
			{
				from: "users",
				localField: "userId",
				foreignField: "_id",
				as: "user_expenses"
			}
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
		userId: userId,
		user: user,
		isActive: data.isActive,
		createdAt: Date.now()
	});

	await expense.save();
	return expense;
};

const updateExpense = async (data) => {
	return await Expense.findById(id);
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
