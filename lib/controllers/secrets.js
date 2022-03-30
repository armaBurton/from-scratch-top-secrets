const Router = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');
const SecretService = require('../services/SecretService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const secret = await SecretService.getSecrets();

      res.json(secret);
    } catch (error) {
      next(error);
    }
  });
