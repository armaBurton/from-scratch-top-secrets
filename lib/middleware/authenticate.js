const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  /*
  Check for the session cookie and verify
  its contents using jsonwebtoken, then
  assign the payload to req.user
  */
  try{
    const cookie = req.cookies[process.env.COOKIE_NAME];
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch(error){
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};
