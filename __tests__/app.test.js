const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const User = require('../lib/models/User');
const jwt = require('jsonwebtoken');


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

  
  it.skip('returns a list of secrets', async () => {
    // const res = 
  });

  it.skip('returns the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');

    expect(me.body).toEqual({
      ...user, 
      exp: expect.any(Number),
      iat: expect.any(Number)
    });
  });

  it.skip('creates a new user', async () => {
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

});
