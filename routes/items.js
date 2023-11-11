
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const checkAuthorization = require('../middlewares/checkAuth');
// router.post('/add',itemController.add);
router.patch('/update/:itemid',checkAuthorization.checkAuth,itemController.update);
router.delete('/delete/:itemid',checkAuthorization.checkAuth,itemController.delete);
router.get('/show',itemController.show);
module.exports =router
