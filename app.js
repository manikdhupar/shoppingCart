const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');
const csrfProtection = csrf();

const flash = require('connect-flash');

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

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        return next();
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    return next();
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

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
