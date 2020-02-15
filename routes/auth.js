const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const { userModel, validateForLogin } = require('../models/users');
const router = express.Router();

//Login request
router.post('/', async (req, res) => {
	try {
		const { error } = validateForLogin(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await userModel.getUser({ email: req.body.email });
		if (!user) return res.status(400).send('Invalid email or password.');

		const validPassword = bcrypt.compareSync(req.body.password, user.password);
		if (!validPassword) return res.status(400).send('Invalid email or password.');

		const token = user.getAuthenticationToken();
		return res.send(token);
	} catch (error) {
		res.send(error.message);
	}
});

module.exports = router;
