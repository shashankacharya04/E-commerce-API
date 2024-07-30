const jwt = require('jsonwebtoken');
function checkAuth(req,res,next){
    try{
    // const token = req.headers.authorization.split(" ")[1]; 
    //instead of this we can add token in te cookies
    const token = req.cookies.jwt;
    console.log("token in auth",token);
    const decodedToken = jwt.verify(token,process.env.JWT_KEY);
    req.userData = decodedToken;
    next();
    }
    catch(error){
        return res.status(401).json({
            message:"user didnt signin/login...",
            error:error
        });
    }
}
module.exports ={
    checkAuth:checkAuth,
}