import db from '../../src/db/index.js';
import * as userClient from '../../src/temporal/clients/user.client.js';

const { User } = db;

describe('user API Integration Testing', () => {
  let stubs = {};

  beforeEach(() => {
    // Reset stubs before each test
    stubs = {};
  });

  afterEach(() => {
    // Restore all stubs after each test
    Object.values(stubs).forEach(stub => {
      if (stub && stub.restore) {
        stub.restore();
      }
    });
    sinon.restore();
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve a user with specific id', (done) => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
      };

      // Mock the Temporal workflow client
      stubs.startGetUser = sinon.stub(userClient, 'startGetUser').resolves({
        code: 200,
        user: mockUser,
      });

      chai.request(app)
        .get('/api/users/1')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.name).to.equal('Test User');
          expect(res.body.email).to.equal('test@example.com');
          expect(stubs.startGetUser.calledOnce).to.be.true;
          expect(stubs.startGetUser.calledWith('1')).to.be.true;
          done();
        });
    });

    it('should return 404 when user is not found', (done) => {
      // Mock the Temporal workflow client to return not found
      stubs.startGetUser = sinon.stub(userClient, 'startGetUser').resolves({
        code: 404,
        message: 'User not found',
        user: null,
      });

      chai.request(app)
        .get('/api/users/999')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('User not found');
          expect(stubs.startGetUser.calledOnce).to.be.true;
          done();
        });
    });
  });

  describe('GET /api/users', () => {
    it('should retrieve all users', (done) => {
      const mockUsers = [
        {
          id: 1,
          name: 'User One',
          email: 'user1@example.com',
          mobile: '1111111111',
        },
        {
          id: 2,
          name: 'User Two',
          email: 'user2@example.com',
          mobile: '2222222222',
        },
      ];

      // Mock the Temporal workflow client
      stubs.startGetAllUsers = sinon.stub(userClient, 'startGetAllUsers').resolves({
        code: 200,
        users: mockUsers,
      });

      chai.request(app)
        .get('/api/users')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(res.body[0].id).to.equal(1);
          expect(res.body[1].id).to.equal(2);
          expect(stubs.startGetAllUsers.calledOnce).to.be.true;
          expect(stubs.startGetAllUsers.calledWith({ limit: 100, offset: 0 })).to.be.true;
          done();
        });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', (done) => {
      const newUserData = {
        name: 'New User',
        email: 'newuser@example.com',
        mobile: '9999999999',
      };

      const mockResult = {
        code: 201,
        message: 'Your account created successfully.',
        id: 3,
        user: {
          id: 3,
          ...newUserData,
        },
      };

      // Mock the Temporal workflow client
      stubs.startCreateUser = sinon.stub(userClient, 'startCreateUser').resolves(mockResult);

      chai.request(app)
        .post('/api/users')
        .send(newUserData)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('Your account created successfully.');
          expect(res.body.id).to.equal(3);
          expect(res.body.user.name).to.equal('New User');
          expect(stubs.startCreateUser.calledOnce).to.be.true;
          done();
        });
    });

    it('should return 409 when duplicate mobile number found', (done) => {
      const duplicateUserData = {
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        mobile: '1111111111',
      };

      // Mock the Temporal workflow client to return duplicate
      stubs.startCreateUser = sinon.stub(userClient, 'startCreateUser').resolves({
        code: 409,
        id: 1,
        message: 'Duplicate mobile number found. Possible fraud.',
      });

      chai.request(app)
        .post('/api/users')
        .send(duplicateUserData)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res).to.have.status(409);
          expect(res.body.message).to.include('Duplicate');
          expect(stubs.startCreateUser.calledOnce).to.be.true;
          done();
        });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', (done) => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      // Mock the Temporal workflow client
      stubs.startUpdateUser = sinon.stub(userClient, 'startUpdateUser').resolves({
        code: 200,
        success: true,
        id: '1',
      });

      chai.request(app)
        .put('/api/users/1')
        .send(updateData)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal('User updated successfully.');
          expect(res.body.id).to.equal('1');
          expect(stubs.startUpdateUser.calledOnce).to.be.true;
          expect(stubs.startUpdateUser.calledWith({
            id: '1',
            userData: updateData,
          })).to.be.true;
          done();
        });
    });
  });
});
