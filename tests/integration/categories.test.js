const { User } = require('../../models/users');
const { Category } = require('../../models/categories');
const request = require('supertest');
const mongoose = require('mongoose');

let server;
let token;

describe('/api/categories/', () => {
    beforeEach(() => {
        server = require('../../index');
        token = new User().getAuthenticationToken();
    });

    afterEach(async () => {
        await Category.deleteMany({})
        await server.close();
    });

    describe('GET /', () => {
        afterEach(async () => {
            await Category.deleteMany({})
            await server.close();
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await request(server).get('/api/categories').set('x-auth-token', token);
            expect(res.status).toBe(401);
        });

        it('should return all categories', async () => {
            await Category.collection.insertMany([{ name: 'Foodies' }, { name: 'Groceries' }]);
            const res = await request(server).get('/api/categories').set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === 'Foodies')).toBeTruthy();
            expect(res.body.some((g) => g.name === 'Groceries')).toBeTruthy();
        });

        it('should return a category if a valid id is passed', async () => {
            const category = new Category({ name: 'Foodies' });
            await category.save();
            const res = await request(server).get('/api/categories/' + category._id).set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', category.name);
        });
    });

    describe('POST /', () => {
        let name;

        beforeEach(() => {
            name = 'Foodies';
        });

        afterEach(async () => {
            await Category.deleteMany({})
            await server.close();
        });

        const exec = () => {
            return request(server).post('/api/categories').set('x-auth-token', token).send({ name: name });
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await request(server).get('/api/categories').set('x-auth-token', token);
            expect(res.status).toBe(401);
        });

        it('should return 400 if category has less than 3 characters', async () => {
            name = 'uv';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre has more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should create a new category if valid input is passed', async () => {
            await exec();
            const category = await Category.find({ name: 'Foodies' });
            expect(category).not.toBeNull();
        });

        it('should return category if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Foodies');
        });

    });

    describe('UPDATE /', () => {
        let name;
        let categoryId;

        beforeEach(() => {
            categoryId = mongoose.Types.ObjectId().toHexString();
            name = 'My Foodies';
        });

        afterEach(async () => {
            await Category.deleteMany({})
            await server.close();
        });

        const exec = (categoryId) => {
            return request(server).put('/api/categories/' + categoryId).set('x-auth-token', token).send({ name: name });
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';

            const res = await exec(categoryId);
            expect(res.status).toBe(401);
        });

        it('should return 404 if id is not valid', async () => {
            const categoryId = 'red';
            const res = await exec(categoryId);
            expect(res.status).toBe(404);
        });

        it('should return 400 if category has less than 3 characters', async () => {
            name = 'uv';
            const res = await exec(categoryId);
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre has more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec(categoryId);
            expect(res.status).toBe(400);
        });

        it('should update a category if valid input is passed', async () => {
            const category = new Category({ name: 'Foodies' });
            await category.save();
            await exec(category._id);
            const updatedCategory = await Category.findOne({ name: 'My Foodies' });
            expect(updatedCategory).not.toBeNull();
            expect(updatedCategory.name).toContain('My Foodies');
        });

    });

    describe('DELETE /', () => {
        let categoryId;

        beforeEach(() => {
            categoryId = mongoose.Types.ObjectId().toHexString();
            name = 'My Foodies';
        });

        afterEach(async () => {
            await Category.deleteMany({})
            await server.close();
        });

        const exec = (categoryId) => {
            return request(server).delete('/api/categories/' + categoryId).set('x-auth-token', token);
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec(categoryId);
            expect(res.status).toBe(401);
        });

        it('should return 404 if id is not valid', async () => {
            const categoryId = 'red';
            const res = await exec(categoryId);
            expect(res.status).toBe(404);
        });

        it('should return 404 if category is not found', async () => {
            const res = await exec(categoryId);
            expect(res.status).toBe(404);
        });

        it('should delete a category if valid input is passed', async () => {
            const category = new Category({ name: 'Foodies' });
            await category.save();
            const res = await exec(category._id);
            expect(res.body).not.toBeNull();
            expect(res.body.name).toContain('Foodies');
        });
    });
});
