const jwttoken = require('jsonwebtoken');
function checkAuth(req,res,next){
    try{
    // const token = req.headers.authorization.split(" ")[1]; 
    //instead of this we can add token in te cookies
    console.log("cookies are",req)
    const token = req.cookies.jwt;
    console.log("token in auth",token);
    if(!token){ 
        return res.status(401).json({
            "error":"unauthorized access"
        })
         }
    const decodedToken = jwttoken.verify(token,process.env.JWT_KEY);
    if(!decodedToken){
        return res.status(401).json({
            "error":"unauthorized access --invalid token"
        })
    }
    console.log("decoded token is",decodedToken)
    req.userData = decodedToken;

    next();
    }
    catch(error){
        console.log("error in chck auth",error)
       res.status(500).json({
        message:"internal server error",
        error:error.message
       })
    }
}
module.exports ={
    checkAuth:checkAuth,
}


// try {
//     const Token = req.cookies.jwt
//     if(!Token){ 
//     return res.status(401).json({
//         "error":"unauthorized access"
//     })
//      }
//     const decoded = jwt.verify(Token,process.env.JWT_SECRET)
//     if(!decoded){
//         return res.status(401).json({
//             "error":"unauthorized access --invalid token"
//         })
//     }
//     const user = await User.findById(decoded.userId).select("-password");
//     if(!user){
//         res.status(404).json({
//             error:"user not found"
//         })
//     }
//     req.user = user;
//     next();
// } catch (error) {
//     console.log("protected:",error.message);
//     res.status(500).json({
//         message:"internal server error"
//     })
// }