const _ = require('lodash');
const express = require('express');
const { validateUser, userModel } = require('../models/users');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
    const user = await userModel.getUserByIdExcludePassword(req.user._id);
    if (!user) return res.status(404).send('No logged in user found.');

    return res.send(user);
});

router.get('/', async (req, res) => {
    const users = await userModel.getUsers();
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await userModel.getUser({ email: req.body.email });
    if (user) return res.status(404).send('The user is already registered.');

    user = await userModel.createUser(req.body);

    const token = user.getAuthentificationToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'surname', 'email', 'isAdmin', 'isActive']));
});

router.get('/:id', async (req, res) => {
    const user = await userModel.getUserById(req.params.id);

    if (!user) return res.status(404).send('The user with the given id was not found');

    return res.send(user);
});

router.put('/:id', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userModel.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).send('The user with the given id was not found');

    return res.send(user);
});

router.delete('/:id', async (req, res) => {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).send('The user with the given id was not found');

    const result = await userModel.deleteUser(req.params.id);

    return res.send(user);
});

module.exports = router;
