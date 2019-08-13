import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../index';

const should = chai.should();
chai.use(chaiHttp);
chai.should();

// test for trips activities

describe('post', () => {
  describe('POST /', () => {
    it('It should return 201 when the trip is created ', (done) => {
      const Signed = {
        email: 'newuser@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        is_admin: true,
      };
      const trip = {
        seating_capacity: 40,
        bus_license_number: 'RAC476Y',
        origin: 'KIGALI',
        destination: 'RUHANGO',
        trip_date: '09-03-2019',
        fare: 3400,
        time: '15:45',
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      chai
        .request(app)
        .post('/api/v1/trips')
        .set('token', Token)
        .send(trip)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('It should return 201 when trip is created ', (done) => {
      const Signed = {
        id: 6,
        email: 'newuser@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        is_admin: true,
      };
      const trip = {
        seating_capacity: 0,
        bus_license_number: 'RAC176Y',
        origin: 'MABARE',
        destination: 'BISHENYI',
        trip_date: '10-10-2019',
        fare: 3400,
        time: '10:20',
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      chai
        .request(app)
        .post('/api/v1/trips')
        .set('token', Token)
        .send(trip)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('It should return 201 when trip is created ', (done) => {
      const Signed = {
        id: 1,
        email: 'newuser@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        is_admin: true,
      };
      const trip = {
        seating_capacity: 10,
        bus_license_number: 'RAC176Y',
        origin: 'Gisenyi',
        destination: 'Butamwa',
        trip_date: '10-10-2019',
        fare: 3400,
        time: '10:20',
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      chai
        .request(app)
        .post('/api/v1/trips')
        .set('token', Token)
        .send(trip)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('It should return 422 if there is no seating capacity', (done) => {
      const Signed = {
        id: 6,
        email: 'newuser@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        is_admin: true,
      };
      const trip = {
        bus_license_number: 'RAC476Y',
        origin: 'KIGALI',
        destination: 'RUHANGO',
        trip_date: '09-03-2019',
        fare: 3400,
        time: '15:45',
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      chai
        .request(app)
        .post('/api/v1/trips')
        .set('token', Token)
        .send(trip)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });

    it('It should return 409 if the trip is already saved ', (done) => {
      const Signed = {
        id: 6,
        email: 'newuser@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        is_admin: true,
      };
      const trip = {
        seating_capacity: 40,
        bus_license_number: 'RAC476Y',
        origin: 'KIGALI',
        destination: 'RUHANGO',
        trip_date: '09-03-2019',
        fare: 3400,
        time: '15:45',
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      chai
        .request(app)
        .post('/api/v1/trips')
        .set('token', Token)
        .send(trip)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
    });
  });
});

describe('PATCH /', () => {
  it('It should cancel a trip if admin ', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      is_admin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .patch('/api/v1/trips/1/cancel')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('return 406 if the trip is already canceled ', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      is_admin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .patch('/api/v1/trips/1/cancel')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(406);
        done();
      });
  });

  it('It should return 401 if you are not admin ', (done) => {
    const Signed = {
      id: 1,
      email: 'byusa@gmail.com',
      first_name: 'BYUSA',
      last_name: 'PRINCE DACY',
      phoneNumber: ' +250782314242',
      address: 'UMUSAVE',
      is_admin: false,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .patch('/api/v1/trips/1/cancel')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
});

describe('get /', () => {
  it('It should display all the trips ', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      is_admin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .get('/api/v1/trips')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('It should display a specific trip ', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      is_admin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .get('/api/v1/trips/1')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('It should not return trip if there is no trip found with the provided id', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      is_admin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .get('/api/v1/trips/10')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('It should return 401 if no token provided', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      is_admin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .get('/api/v1/trips/10')
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('It should return  401 if you enter an invalid token', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      is_admin: true,
    };
    const Token = 'jwt.sign(Signed, process.env.JWT, { expiresIn: "24h" })';
    chai
      .request(app)
      .get('/api/v1/trips/10')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
});
