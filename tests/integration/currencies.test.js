const { User } = require('../../models/users');
const { Currency } = require('../../models/currencies');
const request = require('supertest');
const mongoose = require('mongoose');

let server;
let token;

describe('/api/currencies/', () => {
    beforeEach(() => {
        server = require('../../index');
        token = new User().getAuthenticationToken();
    });

    afterEach(async () => {
        await Currency.deleteMany({})
        await server.close();
    });

    describe('GET /', () => {
        afterEach(async () => {
            await Currency.deleteMany({})
            await server.close();
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await request(server).get('/api/currencies').set('x-auth-token', token);
            expect(res.status).toBe(401);
        });

        it('should return all currencies', async () => {
            await Currency.collection.insertMany([{ name: 'AED' }, { name: 'USD' }]);
            const res = await request(server).get('/api/currencies').set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === 'AED')).toBeTruthy();
            expect(res.body.some((g) => g.name === 'USD')).toBeTruthy();
        });

        it('should return a currency if a valid id is passed', async () => {
            const currency = new Currency({ name: 'AED' });
            await currency.save();
            const res = await request(server).get('/api/currencies/' + currency._id).set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', currency.name);
        });
    });

    describe('POST /', () => {
        let name;
        let unitDollarRate;

        beforeEach(() => {
            const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
            token = new User(user).getAuthenticationToken();
            name = 'AED';
            unitDollarRate = 3.67;
        });

        afterEach(async () => {
            await Currency.deleteMany({})
            await server.close();
        });

        const exec = () => {
            return request(server).post('/api/currencies').set('x-auth-token', token)
                .send({ name: name, unitDollarRate: unitDollarRate });
        };

        it('should return 400 if input is not valid', async () => {
            unitDollarRate = 'xxx';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should create a new currency if valid input is passed', async () => {
            await exec();
            const currency = await Currency.findOne({ name: 'AED' });
            expect(currency).not.toBeNull();
            expect(currency).toHaveProperty('name', 'AED');
        });
    });

    describe('UPDATE /', () => {
        let name;
        let unitDollarRate;
        let currencyId;

        beforeEach(() => {
            const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
            token = new User(user).getAuthenticationToken();
            currencyId = mongoose.Types.ObjectId().toHexString();
            name = 'CFC';
            unitDollarRate = 1750;
        });

        afterEach(async () => {
            await Currency.deleteMany({});
            await server.close();
        });

        const exec = (currencyId) => {
            return request(server).put('/api/currencies/' + currencyId)
                .set('x-auth-token', token).send({ name: name, unitDollarRate: unitDollarRate });
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec(currencyId);
            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not an admin', async () => {
            const user = { _id: mongoose.Types.ObjectId().toHexString() }
            token = new User(user).getAuthenticationToken();
            const res = await exec(currencyId);
            expect(res.status).toBe(403);
        });

        it('should return 404 if id is not valid', async () => {
            const currencyId = 'red';
            const res = await exec(currencyId);
            expect(res.status).toBe(404);
        });

        it('should update a currency if valid input is passed', async () => {
            const currency = new Currency({ name: 'USD' });
            await currency.save();
            const res = await exec(currency._id);
            const updatedCategory = await Currency.findOne({ name: 'CFC' });
            expect(res.status).toBe(200);
            expect(updatedCategory).not.toBeNull();
            expect(updatedCategory).toHaveProperty('name', 'CFC');
        });
    });

    describe('DELETE /', () => {
        let currencyId;

        beforeEach(() => {
            const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
            token = new User(user).getAuthenticationToken();
            currencyId = mongoose.Types.ObjectId().toHexString();
        });

        afterEach(async () => {
            await Currency.deleteMany({})
            await server.close();
        });

        const exec = (currencyId) => {
            return request(server).delete('/api/currencies/' + currencyId).set('x-auth-token', token);
        };

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec(currencyId);
            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not an admin', async () => {
            const user = { _id: mongoose.Types.ObjectId().toHexString() }
            token = new User(user).getAuthenticationToken();
            const res = await exec(currencyId);
            expect(res.status).toBe(403);
        });

        it('should return 404 if id is not valid', async () => {
            const currencyId = 'red';
            const res = await exec(currencyId);
            expect(res.status).toBe(404);
        });

        it('should return 404 if currency is not found', async () => {
            const res = await exec(currencyId);
            expect(res.status).toBe(404);
        });

        it('should delete a currency if valid input is passed', async () => {
            const currency = new Currency({ name: 'CFC' });
            await currency.save();
            const res = await exec(currency._id);
            expect(res.status).toBe(200);
            expect(res.body).not.toBeNull();
            expect(res.body).toHaveProperty('name', 'CFC');
        });
    });
});
