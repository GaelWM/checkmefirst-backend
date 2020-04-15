const { User } = require('../../models/users');
const { Currency } = require('../../models/currencies');
const request = require('supertest');

let server;
let token;
let name;

describe('admin middleware', () => {

    beforeEach(() => {
        server = require('../../index');
        token = new User().getAuthenticationToken();
        name = 'CFC';
    });

    afterEach(async () => {
        await Currency.remove({})
        await server.close();
    });

    const exec = () => {
        return request(server).post('/api/currencies').set('x-auth-token', token).send({ name: name });
    };

    it('should return 403 if req.user does not contain the isAdmin parameter', async () => {
        const res = await exec();
        expect(res.status).toBe(403);
    });
});