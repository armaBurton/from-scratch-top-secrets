const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Secret = require('../models/Secret');

module.exports = class SecretService {
  static async getSecrets(req, res, next){
    try {
      const secret = await Secret.getSecrets();
    
      return secret;
    } catch (error) {
      next(error);
    }
  }
};
