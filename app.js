const express = require('express');
const cors =require("cors");
const dotenv = require("dotenv")
const cookie = require("cookie-parser");
const app= express();
const bodyParser =require('body-parser');
const userRoute = require('./routes/user');
const itemRoute = require('./routes/items');
const sellerRoute = require('./routes/sellers');
const cloudinnary = require("cloudinary").v2;

dotenv.config();
app.use(cookie());
app.use(cors());
app.use(bodyParser.json({limit:"50mb"}));
//app.use(bodyParser.urlencoded({     parameterLimit: 100000,     limit: '50mb',     extended: true   }));


cloudinnary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

app.use('/user',userRoute);
app.use('/item',itemRoute);
app.use('/seller',sellerRoute);



module.exports= app;