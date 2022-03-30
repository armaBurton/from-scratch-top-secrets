const Router = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {

      const { email, password } = req.body;
      const sessionToken = await UserService.signIn({ email, password });

      const cookie = res.cookie(process.env.COOKIE_NAME, sessionToken, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      }).json({ message: 'Signed in successfully!' });

      console.log('|| cookie >', cookie);

      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });
