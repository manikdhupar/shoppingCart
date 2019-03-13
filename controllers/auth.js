const User = require('../models/user');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  message.length > 0 ? (message = message[0]) : (message = null);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Username Or Password');
        return res.redirect('/login');
      }
      return bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            req.flash('error', 'Invalid Username Or Password');
            res.redirect('/login');
          } else {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
              if (err) {
                console.log(err);
              } else {
                res.redirect('/');
              }
            });
          }
        })
        .catch(err => {
          if (err) {
            console.log(err);
          }
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  message.length > 0 ? (message = message[0]) : (message = null);
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  return User.findOne({ email: email })
    .then(user => {
      if (user) {
        req.flash('error', 'Email already exists.');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(user => {
          res.redirect('/');
          return transporter.sendMail({
            to: email,
            from: 'manik.dhupar7@gmail.com',
            subject: 'Signup Succeed',
            html:
              '<h1>Congrats ,  You successfully signed up. Enjoy the services !!</h1>'
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
