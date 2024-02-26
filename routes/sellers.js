const express = require('express');
const router = express.Router();
const sellersController = require('../controllers/sellers.controller');
const checkAuthorization =require('../middlewares/checkAuth');
router.post('/signin',sellersController.signin);
router.post('/login',sellersController.login);
router.patch('/update',checkAuthorization.checkAuth,sellersController.update);
router.post('/additem',checkAuthorization.checkAuth,sellersController.additem);
router.get('/:sellerId',checkAuthorization.checkAuth,sellersController.itemSold);
module.exports =router