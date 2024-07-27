const jwt = require('jsonwebtoken');
const multer = require("multer");
const uploads = multer ({dest:'/uploads'});
function checkAuth(req,res,next){
    try{
    //const token = req.headers.authorization.split(" ")[1]; 
    //instead of this we can add token in te cookies
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token,process.env.JWT_KEY);
    req.userData = decodedToken;
    next();
    }
    catch(error){
        return res.status(401).json({
            message:"user didnt signin/login",
            error:error
        });
    }
}
// function addImage (req,res,next){
//     uploads.single(req.filename);
//     next();
//     console.log("image added successfully",res)
// }
module.exports ={
    checkAuth:checkAuth,
}