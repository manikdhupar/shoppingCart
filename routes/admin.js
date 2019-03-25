const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/isAuth');

const { body } = require('express-validator/check');

const router = express.Router();

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
  '/add-product',
  [
    isAuth,
    body('title')
      .toString()
      .withMessage('Title is not a valid string')
      .isLength({ min: 3 })
      .withMessage('Title must be a at least 3 characters long!')
      .trim(),
    body('imageUrl').trim(),
    body('description', 'Enter a valid description')
      .isLength({ min: 5 })
      .trim(),
    body('price', 'Enter a valid Price').isFloat()
  ],
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    isAuth,
    body('title')
      .toString()
      .withMessage('Title is not a valid string')
      .isLength({ min: 3 })
      .withMessage('Title must be a at least 3 characters long!')
      .trim(),
    body('imageUrl').trim(),
    body('description', 'Enter a valid description')
      .isLength({ min: 5 })
      .trim(),
    body('price', 'Enter a valid Price').isFloat()
  ],
  adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
