const admin = require('../../../middleware/admin');
const mongoose = require('mongoose');

describe('admin middleware', () => {
    let user;
    beforeEach(() => {
        user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
    });

    it('should return 200 if req.user does contain the isAdmin parameter', () => {
        const req = { user }

        const res = {};
        const next = jest.fn();
        admin(req, res, next);

        expect(req.user).toMatchObject(user);
        expect(req.user).toHaveProperty('isAdmin', true);
    });
});
