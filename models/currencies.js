const Joi = require('joi');
const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const currencySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
    },
    unitDollarRate: {
        type: Number,
        required: false,
    },
});

currencySchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
});

const Currency = mongoose.model('Currency', currencySchema);

const getCurrencies = async () => {
    return await Currency.find().sort('name');
};

const getCurrencyById = async (id) => {
    return await Currency.findById(id);
};

const getCurrencyByName = async (name) => {
    return await Currency.findOne({ name: { $regex: new RegExp("^" + name.toLowerCase(), "i") } });
};

const createCurrency = async (data) => {
    const currency = new Currency({
        name: data.name,
        unitDollarRate: data.unitDollarRate,
    });

    await currency.save();

    return currency;
};

const updateCurrency = async (id, data) => {
    return await Currency.findByIdAndUpdate(
        id,
        {
            $set: {
                name: data.name,
                unitDollarRate: data.unitDollarRate,
            }
        },
        { new: true }
    );
};

const deleteCurrency = async (id) => {
    return await Currency.findByIdAndDelete(id);
};

function validateCurrency(currency) {
    const schema = {
        name: Joi.string().required(),
        unitDollarRate: Joi.number(),
    };

    return Joi.validate(currency, schema);
}

module.exports.Currency = Currency;
module.exports.validateCurrency = validateCurrency;
module.exports.currencyModel = {
    getCurrencies,
    getCurrencyById,
    getCurrencyByName,
    createCurrency,
    updateCurrency,
    deleteCurrency
};
