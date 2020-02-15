const { User } = require('../../models/users');
const { Category } = require('../../models/categories');
const request = require('supertest');
const mongoose = require('mongoose');

let server;
let token;
let name;
const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
        token = new User(user).getAuthenticationToken();
        name = 'Foodies';
    });

    afterEach(async () => {
        await Category.remove({})
        await server.close();
    });

    const exec = () => {
        return request(server).post('/api/categories').set('x-auth-token', token).send({ name });
    };

    it('should return 401 if token is not provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});
