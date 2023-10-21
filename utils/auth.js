const jwt = require("jsonwebtoken");

//? to verify token validity sent by tushar

//! for checking on postman purposes: Header - >
//! Authorization : bearer 'Real_Token_Value'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


module.exports = verifyToken;