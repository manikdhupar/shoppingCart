const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const mongoose = require('mongoose');

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

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5c83be3f4e93980bef5eb4c9')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb://localhost:27017/shop')
  // .connect(
  //   'mongodb+srv://manik_dhupar:fumYPyxmnlGLKrMR@cluster0-avpiv.mongodb.net/shop?retryWrites=true'
  // )
  .then(result => {
    console.log('database connected');
    return User.findOne();
  })
  .then(user => {
    if (!user) {
      const user = new User({
        name: 'Manik',
        email: 'manik.dhupar7@gmail.com',
        cart: {
          items: []
        }
      });
      return user.save();
    }
  })
  .then(() => {
    console.log('server started at PORT:3000');
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
