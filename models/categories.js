const Joi = require('joi');
const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    }
});

//categorySchema.plugin(uniqueValidator);
const Category = mongoose.model('Category', categorySchema);

const getCategories = async () => {
    return await Category.find().sort('name');
};

const getCategoryById = async (id) => {
    return await Category.findById(id);
};

const createCategory = async (data) => {
    const category = new Category({
        name: data.name
    });

    await category.save();

    return category;
};

const updateCategory = async (id, data) => {
    return await Category.findOneAndUpdate(
        id,
        {
            $set: {
                name: data.name,
            }
        },
        { new: true }
    );
};

const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

function validateCategory(category) {
    const schema = {
        name: Joi.string().max(10).required(),
    };

    return Joi.validate(category, schema);
}

module.exports.Category = Category;
module.exports.validateCategory = validateCategory;
module.exports.categoryModel = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
