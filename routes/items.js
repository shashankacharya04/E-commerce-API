
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const checkAuthorization = require('../middlewares/checkAuth');
const item = require('../models/item');
// router.post('/add',itemController.add);
router.patch('/update/:itemid',checkAuthorization.checkAuth,itemController.update);
router.delete('/delete/:itemid',checkAuthorization.checkAuth,itemController.delete);
router.get('/show',itemController.show);
router.get('/:itemid',itemController.singleItem);
router.post('/comment/:itemid',checkAuthorization.checkAuth,itemController.comments);
router.get('/comment/:itemid',itemController.getcomments);
module.exports =router
