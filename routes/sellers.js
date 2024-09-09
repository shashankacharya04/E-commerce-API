const express = require('express');
const router = express.Router();
const sellersController = require('../controllers/sellers.controller');
const checkAuthorization =require('../middlewares/checkAuth');
// const multer = require("multer");
// const storage = multer.diskStorage({
//     destination:(file,req,cb)=>{
//        cb(null,"/uploads") ;
//     },
//     filename:(req,file,cb)=>{
//         cb (null,filename.originalname)
//     },
// })
// const uploads = multer ({dest:'/uploads'});
router.post('/signin',sellersController.signin);
router.post('/login',sellersController.login);
router.patch('/update',checkAuthorization.checkAuth,sellersController.update);
router.post('/additem',checkAuthorization.checkAuth,sellersController.additem);
router.get('/:sellerId',checkAuthorization.checkAuth,sellersController.itemSold);
module.exports =router