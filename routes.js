const express = require('express');
const router = express.Router();

const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController');
const cartController = require('./controllers/cartController');
const userController = require('./controllers/userControllers');

const authenticateUser = require('./middlewares/authenticateUser');
const checkAdmin = require('./middlewares/checkAdmin');


/** CATEGORY ROUTES  */
router.post('/addCategory', authenticateUser, checkAdmin, categoryController.addNewCategory);
router.post('/deleteCategory', authenticateUser, checkAdmin, categoryController.deleteCategory);
router.get('/getCategory', authenticateUser, checkAdmin, categoryController.getCategory);
router.post('/updateCategory/:categoryId', authenticateUser, checkAdmin, categoryController.updateCategory);

/** PRODUCTS ROUTES  */
router.post('/addProduct', authenticateUser, checkAdmin, productController.addNewProduct);
router.post('/deleteProduct', authenticateUser, checkAdmin, productController.deleteProduct);
router.get('/getProduct', authenticateUser, checkAdmin, productController.getProduct);
router.post('/updateProduct/:id', authenticateUser, productController.updateProduct);

/** USER ROUTES  */
router.post('/signup', userController.signup);
router.post('/login', userController.login);

/** CART ROUTES  */
router.post('/addCart', authenticateUser, cartController.addNewCartProduct);
router.delete('/removeCartProduct', authenticateUser, cartController.deleteCartProduct);
router.post('/checkout', authenticateUser, cartController.checkout);
router.get('/userCart/:userId', authenticateUser, cartController.getCartProduct);


module.exports = router;