import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../index';
import trips from '../models/tripsModels';
import { book } from '../controllers/bookingControllers';
import bookings from '../models/bookingsModels';

const should = chai.should();
chai.use(chaiHttp);
chai.should();

describe('post Bookings', () => {
  describe('POST /', () => {


    it('It should get a status of 404 when the user is admin and there is no bookings in data base ', (done) => {
      const Signed = {
        id: 1,
        email: 'niyeric11@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        isAdmin: true,
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      chai
        .request(app)
        .get('/api/v1/bookings')
        .set('token', Token)
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });






    it('It should book a seat if trip id exist and user have not yet book a seat ', (done) => {
      const Signed = {
        id: 1,
        email: 'niyeric11@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        isAdmin: true,
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      const booking = { tripId: 3 };
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('token', Token)
        .send(booking)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('It should return 201 if the user has already book and made more ', (done) => {
      const Signed = {
        id: 1,
        email: 'niyeric11@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        isAdmin: true,
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      const booking = { tripId: 3 };
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('token', Token)
        .send(booking)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('It should return 422 if trip id is not provided ', (done) => {
      const Signed = {
        id: 6,
        email: 'newuser@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        isAdmin: true,
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });

      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('token', Token)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });

    it("It should return 404 if trip doesn't exist ", (done) => {
      const Signed = {
        id: 6,
        email: 'newuser@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        isAdmin: true,
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      const booking = { tripId: 40 };
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('token', Token)
        .send(booking)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('It should return 406 if trip has been canceled ', (done) => {
      const Signed = {
        id: 1,
        email: 'niyeric11@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        isAdmin: true,
      };
      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      const booking = { tripId: 1 };
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('token', Token)
        .send(booking)
        .end((err, res) => {
          expect(res.status).to.equal(406);
          done();
        });
    });

    it('It should return 406 when the seating capacity <=0 ', (done) => {
      const Signed = {
        id: 1,
        email: 'niyeric@gmail.com',
        first_name: 'Niyonsenga',
        last_name: 'Eric',
        phoneNumber: '0789769787',
        address: 'Kacyiru',
        isAdmin: true,
      };

      const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
      const booking = { tripId: 2 };
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('token', Token)
        .send(booking)
        .end((err, res) => {
          expect(res.status).to.equal(406);
          done();
        });
    });
  });
});

describe('get Bookings /', () => {
  it('It should get a status of 200 when the user is admin where he/she can view all the bookings made ', (done) => {
    const Signed = {
      id: 1,
      email: 'niyeric11@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      isAdmin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .get('/api/v1/bookings')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('It should get a status of 200 when a user had made bookings ', (done) => {
    const Signed = {
      id: 1,
      email: 'byusa@gmail.com',
      first_name: 'BYUSA',
      last_name: 'PRINCE DACY',
      phoneNumber: '0782314242',
      address: 'UMUSAVE',
      isAdmin: false,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .get('/api/v1/bookings')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('It should get a status of 404 when a user had never made a booking ', (done) => {
    const Signed = {
      id: 4,
      email: 'paul@gmail.com',
      first_name: 'NDABUKIYE',
      last_name: 'PAUL',
      phoneNumber: ' +250782314242',
      address: 'RUTURUSU',
      isAdmin: false,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .get('/api/v1/bookings')
      .set('token', Token)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});

describe('delete A Booking /', () => {
  it('it should return 200 the user delete his bookings and  operation was successful', (done) => {
    const Signed = {
      id: 1,
      email: 'niyeric11@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      isAdmin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .delete('/api/v1//bookings/1')
      .set('token', Token)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('it should return 404(Booking not Found!) if the user try to delete a booking that does not belong  to him', (done) => {
    const Signed = {
      id: 6,
      email: 'newuser@gmail.com',
      first_name: 'Niyonsenga',
      last_name: 'Eric',
      phoneNumber: '0789769787',
      address: 'Kacyiru',
      isAdmin: true,
    };
    const Token = jwt.sign(Signed, process.env.JWT, { expiresIn: '24h' });
    chai
      .request(app)
      .delete('/api/v1//bookings/1')
      .set('token', Token)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});
