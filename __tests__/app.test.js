const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const dummy = {
  firstName: 'Donkey',
  lastName: 'Kong',
  email: 'bananas@forever.ape',
  password: 'm0nk3yBus1n3ss'
};

const registerAndLogin = async (userProps = {}) =>{
  const password = userProps.password ?? dummy.password;

  //Create an "agent" that gives us the ability
  //to store cookies between requests in a test
  const agent = request.agent(app);

  //create a user to sign in with
  const user = await UserService.create({ ...dummy, ...userProps });

  //then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(dummy);

    const { firstName, lastName, email } = dummy;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email
    });
  });

  it.only('returns the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');

    expect(me.body).toEqual({
      ...user, 
      exp: expect.any(Number),
      iat: expect.any(Number)
    });

  });
});
