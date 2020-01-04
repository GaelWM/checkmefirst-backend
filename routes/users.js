const _ = require('lodash');
const express = require('express');
const { validate, userModel } = require('../models/users');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
    console.log(req.user);
    try {
        const user = await userModel.getUserByIdExcludePassword(req.user._id);
        if (!user) return res.status(404).send('The genre with the given id was not found');

        return res.send(user);
    } catch (error) {
        res.send(error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userModel.getUsers();
        res.send(users);
    } catch (error) {
        res.send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await userModel.getUser({ email: req.body.email });
        if (user) return res.status(404).send('The user is already registered.');

        user = await userModel.createUser(_.pick(req.body, ['name', 'email', 'password']));

        const token = user.getAuthentificationToken();
        return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (error) {
        res.send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        //const user = users.find((g) => g.id === parseInt(req.params.id));
        if (!user) return res.status(404).send('The user with the given id was not found');
        return res.send(user);
    } catch (error) {
        res.send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        //const user = users.find((g) => g.id === parseInt(req.params.id));
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await userModel.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).send('The user with the given id was not found');

        return res.send(user);
    } catch (error) {
        res.send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // const user = users.find((g) => g.id === parseInt(req.params.id));
        const user = await userModel.getUserById(req.params.id);
        if (!user) return res.status(404).send('The user with the given id was not found');

        // const index = users.indexOf(user);
        // users.splice(index, 1);
        const result = await userModel.deleteUser(req.params.id);

        return res.send(user);
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
