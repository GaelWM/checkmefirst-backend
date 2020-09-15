const { User } = require('../../models/users');
const request = require('supertest');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

let server;
let token;
let userSample, userSampleTwo;


describe('/api/users/', () => {
    beforeEach(() => {
        server = require('../../index');
        const adminUser = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
        token = new User(adminUser).getAuthenticationToken();
        userSample = {
            name: 'Gael',
            surname: 'Musi',
            gender: 'Male',
            email: 'gael@checkmefirst.com',
            password: bcrypt.hashSync('myPassword', bcrypt.genSaltSync(10)),
            remember: 'X-52854',
            isAdmin: true,
            isActive: true
        }
        userSampleTwo = {
            name: 'Sylvia',
            surname: 'Mukewu',
            gender: 'Female',
            email: 'sylvia@checkmefirst.com',
            password: bcrypt.hashSync('myPassword', bcrypt.genSaltSync(10)),
            remember: 'X-528gfh',
            isAdmin: false,
            isActive: true
        }
    });

    afterEach(async () => {
        await User.deleteMany({})
        await server.close();
    });

    describe('GET /', () => {
        afterEach(async () => {
            await User.deleteMany({})
            await server.close();
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await request(server).get('/api/users').set('x-auth-token', token);
            expect(res.status).toBe(401);
        });

        it('should return all users', async () => {
            await User.collection.insertMany([userSample, userSampleTwo]);
            const res = await request(server).get('/api/users').set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === 'Gael')).toBeTruthy();
            expect(res.body.some((g) => g.name === 'Sylvia')).toBeTruthy();
        });

        it('should return a user if a valid id is passed', async () => {
            const user = new User(userSample);
            await user.save();
            const res = await request(server).get('/api/users/' + user._id).set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', user.name);
        });
    });

    describe('POST /', () => {

        beforeEach(() => {
            server = require('../../index');
        });

        afterEach(async () => {
            await User.deleteMany({})
            await server.close();
        });

        const exec = () => {
            return request(server).post('/api/users').set('x-auth-token', token).send(userSample);
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await request(server).get('/api/users').set('x-auth-token', token);
            expect(res.status).toBe(401);
        });

        it('should return 403 if logged in user is not an admin', async () => {
            const adminUser = { _id: mongoose.Types.ObjectId().toHexString() }
            token = new User(adminUser).getAuthenticationToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should return 400 if email is not a valid email', async () => {
            userSample = { ...userSample, email: 'gael.com' }
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 user name has more than 100 characters', async () => {
            userSample = { ...userSample, name: new Array(102).join('a') }
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should create a new user if valid inputs are passed', async () => {
            const res = await exec();
            const user = await User.findOne({ name: 'Gael' });
            expect(res.status).toBe(200);
            expect(user).not.toBeNull();
            expect(user).toHaveProperty('name', 'Gael');
        });

    });

    describe('UPDATE /', () => {
        let userId = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }

        beforeEach(() => {
            server = require('../../index');
        });

        afterEach(async () => {
            await User.deleteMany({});
            await server.close();
        });

        const exec = (userId) => {
            return request(server).put('/api/users/' + userId).set('x-auth-token', token).send(userSample);
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec(userId);
            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not an admin', async () => {
            const user = { _id: mongoose.Types.ObjectId().toHexString() }
            token = new User(user).getAuthenticationToken();
            const res = await exec(userId);
            expect(res.status).toBe(403);
        });

        it('should return 404 if id is not valid', async () => {
            const userId = 'red';
            const res = await exec(userId);
            expect(res.status).toBe(404);
        });

        it('should update a user if valid input is passed', async () => {
            const user = new User(userSampleTwo);
            await user.save();
            const res = await exec(user._id);
            const updatedUser = await User.findOne({ name: 'Gael' });
            expect(res.status).toBe(200);
            expect(updatedUser).not.toBeNull();
            expect(updatedUser).toHaveProperty('name', 'Gael');
        });
    });

    describe('DELETE /', () => {
        let userId;

        beforeEach(() => {
            const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
            token = new User(user).getAuthenticationToken();
            userId = mongoose.Types.ObjectId().toHexString();
        });

        afterEach(async () => {
            await User.deleteMany({})
            await server.close();
        });

        const exec = (userId) => {
            return request(server).delete('/api/users/' + userId).set('x-auth-token', token);
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec(userId);
            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not an admin', async () => {
            const user = { _id: mongoose.Types.ObjectId().toHexString() }
            token = new User(user).getAuthenticationToken();
            const res = await exec(userId);
            expect(res.status).toBe(403);
        });

        it('should return 404 if id is not valid', async () => {
            const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
            token = new User(user).getAuthenticationToken();
            const userId = 'red';
            const res = await exec(userId);
            expect(res.status).toBe(404);
        });

        it('should return 404 if user is not found', async () => {
            const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
            token = new User(user).getAuthenticationToken();
            const res = await exec(userId);
            expect(res.status).toBe(404);
        });

        it('should delete a user if valid id is passed', async () => {
            const user = new User(userSample);
            await user.save();
            const res = await exec(user._id);
            expect(res.status).toBe(200);
            expect(res.body).not.toBeNull();
            expect(res.body).toHaveProperty('name', 'Gael');
        });
    });
});