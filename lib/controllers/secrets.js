const Router = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {

      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });
