const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const User = require('../lib/models/User');
const jwt = require('jsonwebtoken');
const secrets = require('../lib/controllers/secrets');


const dummy = {
  firstName: 'Donkey',
  lastName: 'Kong',
  email: 'bananas@forever.ape',
  password: 'm0nk3yBus1n3ss'
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? dummy.password;

//   //Create an "agent" that gives us the ability
//   //to store cookies between requests in a test
//   const agent = request.agent(app);

//   //create a user to sign in with
//   const user = await UserService.create({ ...dummy, ...userProps });

//   //then sign in
//   const { email } = user;
//   await agent.post('/api/v1/users/sessions').send({ email, password });
//   return [agent, user];
// };

describe('alchemy-app routes', () => {
  beforeAll(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('logs in a user', async () => {
    await UserService.create({
      firstName: 'Donkey',
      lastName: 'Kong',
      email: 'bananas@forever.ape',
      password: 'm0nk3yBus1n3ss'
    });

    const res = await request.agent(app)
      .post('/api/v1/users/sessions')
      .send({
        email: 'bananas@forever.ape',
        password: 'm0nk3yBus1n3ss' 
      });

    expect(res.body).toEqual({
      message: 'Signed in successfully!',
      user: expect.any(String)
    });
  });

  it('logs out a user', async () => {
    const user = await UserService.create({
      firstName: 'Donkey',
      lastName: 'Kong',
      email: 'bananas@forever.ape',
      password: 'm0nk3yBus1n3ss'
    });
    
    const res = await request(app)
      .delete('/api/v1/users/sessions');


    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!'
    });
  });
  
  it('creates a new user', async () => {
    const newUser = {
      firstName: 'Yon',
      lastName: 'Yonson',
      email: 'julios@hair.huts',
      password: 'cuts4cheap'
    };

    const res = await request.agent(app)
      .post('/api/v1/users/')
      .send(newUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName: 'Yon',
      lastName: 'Yonson',
      email: 'julios@hair.huts'
    });
  });
  
  it('logged in users can view a list of secrets', async () => {
    const agent = request.agent(app);

    //No User signed in.
    let res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(401);

    await UserService.create({
      firstName: 'Marky',
      lastName: 'Mark',
      email: 'funky@bunch.boi',
      password: 'l4dyk1ll3r'
    });

    await agent
      .post('/api/v1/users/sessions')
      .send({
        email: 'funky@bunch.boi',
        password: 'l4dyk1ll3r'
      });

    const secretsArr = [
      {
        title: 'Mr. Roboto',
        description: 'Secret secret, I`ve got a secret, under my skin.',
        createdAt: expect.any(String)
      },
      {
        title: 'Benjamin Franklin',
        description: 'Three may keep a secret, if two of them are dead.',
        createdAt: expect.any(String)
      }
    ];

    res = await agent.get('/api/v1/secrets');
    expect(res.body).toEqual(secretsArr);

  });

});
