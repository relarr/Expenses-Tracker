const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signup = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    res.status(422).json({ message: 'Invalid inputs' });
    return;
  }

  const { name, email, password } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email: email });
  } catch (err) {
    res.status(500).json({ message: 'Sign up failed' });
    return;
  }

  if (userExists) {
    res.status(404).json({ message: 'A user with that email already exists' });
    return;
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    res.status(500).json({ message: 'Hashing failed' });
    return;
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    res.status(500).json({ message: 'Could not save user' });
    return;
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    res.status(500).json({ message: 'Token sign failed (signup)' });
    return;
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email: email });
  } catch (err) {
    res.status(500).json({ message: 'Log in failed' });
    return;
  }

  if (!userExists) {
    res.status(403).json({ message: 'User does not exist' });
    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, userExists.password);
  } catch (err) {
    res.status(500).json({ message: 'Compare failed' });
    return;
  }

  if (!isValidPassword) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  let token;
  try {
    token = jwt.sign(
      { userId: userExists.id, email: userExists.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Token sign failed (login)' });
    return;
  }

  res
    .status(201)
    .json({ userId: userExists.id, email: userExists.email, token });
};

exports.signup = signup;
exports.login = login;
