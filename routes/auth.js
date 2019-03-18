const express = require('express');

const authController = require('../controllers/auth');

const User = require('../models/user');

const { check } = require('express-validator/check');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (!user) {
            return Promise.reject('Email does not exist.');
          }
        });
      }),
    check('password', 'Password should be minimum 6 characters long').isLength({
      min: 6
    })
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject('Email already exist.');
          }
        });
      }),
    check('password', 'Password should be minimum 6 characters long').isLength({
      min: 6
    }),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to Match');
      }
      return true;
    })
  ],
  authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
