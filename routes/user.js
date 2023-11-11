const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkAuthorization = require('../middlewares/checkAuth');
router.post('/signin',userController.signin);
router.post('/login',userController.login);
router.patch('/update',checkAuthorization.checkAuth,userController.update);
router.post('/buy/:itemid',checkAuthorization.checkAuth,userController.buy);
router.get('/profile',checkAuthorization.checkAuth,userController.profile);
module.exports =router