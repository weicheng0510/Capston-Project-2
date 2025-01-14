const express = require('express');
const router = express.Router();
const userSignUp = require('../controller/user/userSignUp');
const userSignIn = require('../controller/user/userSignin');
const userDetail = require('../controller/user/userDetail');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/user/userLogout');
const allUsers = require('../controller/user/allUsers');
const userUpdate = require('../controller/user/userUpdate');
const uploadProductControll = require('../controller/product/uploadProduct');
const getAllProducts = require('../controller/product/getAllProducts');
const updateProduct = require('../controller/product/updateProduct');
const getCategoryProduct = require('../controller/product/getCategoryProduct');
const getBrand = require('../controller/product/getBrand');
const getRandomProduct = require('../controller/product/getRandomProduct');
const getCategoryProducts = require('../controller/product/getCategoryProducts');
const getProductDetail = require('../controller/product/getProductDetail');
const addToCart = require('../controller/user/addToCart');
const countCart = require('../controller/user/countCart');
const viewCart = require('../controller/user/viewCart');
const updateCartProductQty = require('../controller/user/updateCartProductQty');
const removeCartProduct = require('../controller/user/removeCartProduct');
const searchProduct = require('../controller/product/searchProduct');
const filterProduct = require('../controller/product/filterProduct');




router.post('/signup', userSignUp);
router.post('/signin', userSignIn);
router.get('/user-details', authToken, userDetail);
router.get('/logout', userLogout);


router.get('/all-users', authToken, allUsers);
router.post('/update-user', authToken, userUpdate);



router.post('/upload-product', authToken, uploadProductControll);
router.get('/products', getAllProducts);
router.post('/update-product', authToken, updateProduct);
router.get('/get-category-products', getCategoryProduct);
router.get('/get-brand', getBrand);
router.get('/get-random-products', getRandomProduct);
router.get('/category-products', getCategoryProducts);
router.post('/product-detail', getProductDetail);
router.get('/search', searchProduct);
router.post('/filter-product', filterProduct);


router.post('/add-to-cart', authToken, addToCart);
router.get('/count-cart', authToken, countCart);
router.get('/view-cart', authToken, viewCart);
router.post('/update-cart-quantity', authToken, updateCartProductQty);
router.post('/remove-cart-product', authToken, removeCartProduct);

module.exports = router;