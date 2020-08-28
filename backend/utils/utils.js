const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createToken = (user) => {
  if (!user.role) {
    throw new Error('No user role specified');
  }

  return jwt.sign(
    {
      // Payload
      sub: user._id,
      email: user.email,
      role: user.role,
      iss: 'api.industryproject',
      aud: 'api.industryproject',
    },
    process.env.JWT_SECRET, // Secret
    {
      // Header
      algorithm: 'HS256',
      expiresIn: '1h',
    }
  );
};

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 12 strength
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const verifyPassword = (passwordAttempt, hashedPassword) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

module.exports = {
    createToken,
    hashPassword,
    verifyPassword
}