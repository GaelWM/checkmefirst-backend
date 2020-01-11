const Joi = require('joi');
const mongoose = require('mongoose');
const { categoryModel } = require('./categories');
const { expenseModel } = require('./expenses');

const expenseItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },
    estimatedPrice: {
        type: Number,
    },
    realPrice: {
        type: Number,
    },
    category: {
        type: categoryModel.categorySchema
    },
    quantity: {
        type: Number,
    },
    expense: expenseModel.expenseSchema,
    status: {
        type: String,
        maxLength: 50,
    },
    isActive: {
        type: Boolean,
    },

});

const ExpenseItem = mongoose.model('ExpenseItem', expenseItemSchema);

const getExpenseItems = async () => {
    return await ExpenseItem.find().sort('name');
};

const getExpenseItemById = async (id) => {
    return await ExpenseItem.findById(id);
};

const createExpenseItem = async (data) => {
    const expenseitem = new ExpenseItem({
        name: data.name,
        estimatedPrice: data.estimatedPrice,
        realPrice: data.realPrice,
        category: { name: data.category.name },
        quantity: data.quantity,
        status: data.status,
        isActive: data.isActive
    });

    await expenseitem.save();

    return expenseitem;
};

const updateExpenseItem = async (id, data) => {
    return await ExpenseItem.findOneAndUpdate(
        id,
        {
            $set: {
                name: data.name,
                estimatedPrice: data.estimatedPrice,
                realPrice: data.realPrice,
                category: { name: data.category.name },
                quantity: data.quantity,
                status: data.status,
                isActive: data.isActive
            }
        },
        { new: true }
    );
};

const deleteExpenseItem = async (id) => {
    return await ExpenseItem.findByIdAndDelete(id);
};

function validateExpenseItem(expenseitem) {
    const schema = {
        name: Joi.string().max(10).required(),
    };

    return Joi.validate(expenseitem, schema);
}

module.exports.ExpenseItem = ExpenseItem;
module.exports.validateExpenseItem = validateExpenseItem;
module.exports.expenseitemModel = {
    getExpenseItems,
    getExpenseItemById,
    createExpenseItem,
    updateExpenseItem,
    deleteExpenseItem,
    expenseItemSchema
};
