const jwt = require('jsonwebtoken')
 function generateTokenAndSetCookie(payload,res){
    try{
        console.log("payload",payload);
        const Token = jwt.sign({payload},process.env.JWT_KEY,{
            expiresIn:'15d'
        })
        console.log("TOken",Token);
        res.cookie("jwt",Token,{
            maxAge:15*24,
            httpOnly:true,
            sameSite:"strict"
        });
        return true
    }catch(error){
        res.status(300).json({
            message:"failed to generateToken"
        })

    }
   
}
module.exports ={
    generateTokenAndSetCookie:generateTokenAndSetCookie
}