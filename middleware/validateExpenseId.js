const mongoose = require('mongoose');

module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.expenseId))
        return res.status(404).send('Invalid ID');

    next();
}