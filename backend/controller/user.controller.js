const jwtDecode = require('jwt-decode');

const User = require('../model/user.model');

const { createToken, hashPassword, verifyPassword } = require('../utils/utils');

const signUp = async (req, res) => {
  console.log('Welcome to SignUp controller');
  try {
    const { email, firstname, lastname } = req.body;
    const hashedPassword = await hashPassword(req.body.password);
    // console.log(req.body);

    const userData = {
      firstname: firstname,
      lastname: lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
    };

    // console.log(userData);

    const existingEmail = await User.findOne({
      email: userData.email,
    }).lean(); // lean () --> the results of the queries will be a same plain JS objects not mongoose documents

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User(userData);
    // console.log(newUser);
    const savedUser = await newUser.save();
    console.log(savedUser);
    if (savedUser) {
      console.log('Welcome to if');
      const token = createToken(savedUser);

      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const expiresAt = decodedToken.exp;

      const { firstname, lastname, email, role } = savedUser;

      const userInfo = {
        firstname,
        lastname,
        email,
        role,
      };
      console.log(userInfo);

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt,
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account',
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: 'There was a problem creating your account',
    });
  }
};

const signIn = async (req, res) => {
  console.log('signin controller');
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({
      email,
    }).lean();

    console.log(user);

    if (!user) {
      return res.status(403).json({
        message: 'Wrong email or password.',
      });
    }

    const passwordCheck = await verifyPassword(password, user.password);

    if (passwordCheck) {
      const { password, ...rest } = user;
      const userInfo = Object.assign({}, { ...rest });
      console.log(userInfo);
      const token = createToken(userInfo);

      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const expiresAt = decodedToken.exp;

      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // use true for https
      });

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt,
      });
    } else {
      res.status(403).json({
        message: 'Wrong email or password.',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Something went wrong.' });
  }
};

module.exports = {
  signUp,
  signIn,
};
