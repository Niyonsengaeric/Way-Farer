import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
// import users from '../src/models/Models';
const should = chai.should();
chai.use(chaiHttp);
chai.should();

/*
 * Test the /GET route
 */

// test for creating users
describe('POST /', () => {
  it('New user, it should return 201', done => {
    const user = {
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      password: '12345six',
      phoneNumber: '0789769787',
      address: 'Kacyiru'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('New user, it should return 201', done => {
    const user = {
      email: 'niyeric11@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      password: '12345six',
      phoneNumber: '0789769787',
      address: 'Kacyiru'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should register non already registered user', done => {
    const user = {
      email: 'benith@gmail.com',
      first_name: 'havugimana',
      last_name: 'Benith',
      password: '12345six',
      phoneNumber: '0784524569',
      address: 'Kabuga',
      is_admin:true
    };

    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should not register already taken email', done => {
    const user = {
      email: 'newuser@gmail.com',
      first_name: 'Rwema',
      last_name: 'kalisa',
      password: '65432six',
      phoneNumber: '0789837734',
      address: 'Kibungo'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        done();
      });
  });

  it('should not register 405 if the provided method is not allowed', done => {
    const user = {
      email: 'newuser@gmail.com',
      first_name: 'Rwema',
      last_name: 'kalisa',
      password: '65432six',
      phoneNumber: '0789837734',
      address: 'Kibungo'
    };

    chai
      .request(app)
      .delete('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(405);
        done();
      });
  });

  it('email should not be empty', done => {
    const user = {
      email: '',
      first_name: 'Mugabo',
      last_name: 'Evode',
      password: '123456six',
      phoneNumber: '0785634779',
      address: 'Kicukiro'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        // console.log(users);
        expect(res.statusCode).to.equal(422);
        done();
      });
  });
});

// test for loging users

describe('POST /', () => {
  it('it should return 401 for Invalid user or password', done => {
    const user = {
      email: 'benith@gmail.com',
      password: '12345678six'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
  });

  it('it should return 401 for Invalid user or password', done => {
    const user = {
      email: 'user8@gmail.com',
      password: '12345six'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
  });

  it('it should return 401 for Invalid user or password', done => {
    const user = {
      email: 'user8@gmail.com',
      password: '123456six'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
  });

  it('it should return 200 if the username match with the password', done => {
    const user = {
      email: 'newuser@gmail.com',
      password: '12345six'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it(' it should return 422 for invalid email and password', done => {
    const user = {
      email: '',
      password: ''
    };

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
        done();
      });
  });

  it('it should return 422 for invalid email ', done => {
    const user = {
      email: '',
      password: '3456six'
    };

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
        done();
      });
  });
});
