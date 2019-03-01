const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

//MONGO CLIENT
const mongoClient = require('./util/database').mongoConnect;

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
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoClient(() => {
  app.listen(3000);
});

// sequelize
//   .sync()
//   .then(result => {
//     return User.findByPk(1);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({ name: 'Manik', email: 'manik.dhupar7@gmail.com' });
//     }
//     return user;
//   })
//   .then(user => {
//     return user.createCart();
//   })
//   .then(() => {
//     app.listen(3000, () => {
//       console.log('SERVER STARTED AT PORT : 3000');
//     });
//   })
//   .catch(err => {
//     console.log(err);
//   });
