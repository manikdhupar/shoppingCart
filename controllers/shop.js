const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then(product => {
      res.render('./shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/products');
    })
    .catch(err => {
      console.log(err);
    });
};

// exports.postCartDelete = (req, res, next) => {
//   const productId = req.body.deleteInput;
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then(products => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(result => {
//       res.redirect('/cart');
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders()
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   let fetchedProducts;
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then(products => {
//       fetchedProducts = products;
//       return req.user.createOrder();
//     })
//     .then(order => {
//       //passing array to addProducts
//       //order.addProduct would have taken only 1 product(seq obj)
//       return order.addProducts(
//         fetchedProducts.map(product => {
//           product.orderItem = { quantity: product.cartItem.quantity };
//           return product;
//         })
//       );
//     })
//     .then(result => {
//       fetchedCart.setProducts(null);
//     })
//     .then(result => {
//       res.redirect('/');
//     })
//     .catch(err => console.log(err));
// };
