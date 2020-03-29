const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

exports.generateToken = (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id },
      jwtSecret,
      { expiresIn: '365 days' },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
}

exports.decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
}