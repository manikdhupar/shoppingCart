const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');
const multer = require('multer');
const uniqid = require('uniqid');

const errorController = require('./controllers/error');

const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');
const csrfProtection = csrf();

const flash = require('connect-flash');

require('dotenv').config();

//USER MODEL
const User = require('./models/user');
// const sequelize = require('./util/database');

//importing modals
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/shop',
  collection: 'sessions'
});

//multer filestrorage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uniqid() + '-' + file.originalname);
  }
});

//multer filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'My Secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        return next();
      })
      .catch(err => {
        return next(new Error(err));
      });
  } else {
    return next();
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   // res.status(500).render('500', {
//   //   pageTitle: 'Error Occured',
//   //   path: '/500'
//   // });
//   res.redirect('/500');
// });

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error Occured',
    path: '/500'
  });
});
mongoose
  .connect('mongodb://localhost:27017/shop')
  // .connect(
  //   'mongodb+srv://manik_dhupar:fumYPyxmnlGLKrMR@cluster0-avpiv.mongodb.net/shop?retryWrites=true'
  // )
  .then(result => {
    console.log('database connected');
    console.log('server started at PORT:3000');
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
