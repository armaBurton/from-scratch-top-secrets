const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Secret = require('../models/Secret');

module.exports = class SecretService {
  static async getSecrets(){

    const secret = await Secret.getSecrets();
  
    return secret;
  }

  static async addSecret({ title, description }){
    const secret = await Secret.addSecret({ title, description});

    return secret;
  }
};
