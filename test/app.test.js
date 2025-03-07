/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

// Require Chai, Chai HTTP, and dotenv
const chai = require('chai');
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');

// Load environment variables from config.env
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('../app');

chai.use(chaiHttp);

describe('User Authentication', () => {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD,
  );
  before(async () => {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should login the user and return a token with valid credentials', (done) => {
    const user = {
      email: 'admin@natours.io',
      password: 'test1234',
    };

    chai
      .request(app)
      .post('/api/v1/users/login')
      .send(user)
      .end((err, res) => {
        if (err) return done(err);

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('status').eql('success');
        chai.expect(res.body).to.have.property('token');
        chai
          .expect(res.body.data.user)
          .to.have.property('email')
          .eql(user.email);
        done();
      });
  });

  it('should return 401 if the password is incorrect', (done) => {
    const user = {
      email: 'admin@natours.io',
      password: 'wrongpassword', // Incorrect password
    };

    chai
      .request(app)
      .post('/api/v1/users/login')
      .send(user)
      .end((err, res) => {
        if (err) return done(err);

        chai.expect(res).to.have.status(401);
        chai.expect(res.body).to.have.property('status').eql('fail');
        chai
          .expect(res.body)
          .to.have.property('message')
          .eql('Incorrect email or password');
        done();
      });
  });

  it('should return 400 if email is missing', (done) => {
    const user = {
      email: '', // Missing email
      password: 'password123',
    };

    chai
      .request(app)
      .post('/api/v1/users/login')
      .send(user)
      .end((err, res) => {
        if (err) return done(err);

        chai.expect(res).to.have.status(400);
        chai.expect(res.body).to.have.property('status').eql('fail');
        chai
          .expect(res.body)
          .to.have.property('message')
          .eql('Please provide an email and a password!');
        done();
      });
  });

  it('should return 401 if the user does not exist', (done) => {
    const user = {
      email: 'nonexistentuser@example.com',
      password: 'password123',
    };

    chai
      .request(app)
      .post('/api/v1/users/login')
      .send(user)
      .end((err, res) => {
        if (err) return done(err);

        chai.expect(res).to.have.status(401);
        chai.expect(res.body).to.have.property('status').eql('fail');
        chai
          .expect(res.body)
          .to.have.property('message')
          .eql('Incorrect email or password');
        done();
      });
  });
});

describe('Tours API', () => {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD,
  );
  before(async () => {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should return tours with / without token', (done) => {
    chai
      .request(app)
      .get('/api/v1/tours')
      .end((err, res) => {
        if (err) return done(err);

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('status').eql('success');
        chai.expect(res.body).to.have.property('results');
        chai.expect(res.body.data).to.have.property('data');
        done();
      });
  });
});
