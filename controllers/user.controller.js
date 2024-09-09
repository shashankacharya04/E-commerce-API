const models = require('../models');
const validator =require('fastest-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4:uuid} =require("uuid")
const {v2:cloudinary} = require('cloudinary')
const generateTokenAndSetCookie  = require("../utils/generateTokenAndSetCookie");
async function signin(req,res){
    try {
        const randomval = uuid()
        const userid = "u" + randomval.substring(0,8);
        //const reqProfPic = req.body.profile_pic || req.body.gender == "male" ? "https://avatar.iran.liara.run/public/4" :"https://avatar.iran.liara.run/public/51"
       let reqProfPic 
        if(req.body.profile_pic == "" || req.body.profile_pic == null ){
       reqProfPic = req.body.gender == "male"? "https://avatar.iran.liara.run/public/4" :"https://avatar.iran.liara.run/public/51"
       }
       else{
        const data = await cloudinary.uploader.upload(req.body.profile_pic);
        reqProfPic=data.secure_url;
       }
        models.users.findOne({where:{ email:req.body.email}}).then(result=>{
            console.log("result:",result)
            if(result!=null){
                res.status(200).json({
                    message:"user already exists"
                });
            }else{
                bcryptjs.genSalt(10,function(error,salt){
                    bcryptjs.hash(req.body.password,salt,function(err,hash){
                        const user ={
                            user_id:userid,
                            user_name:req.body.name,
                            profile_pic:reqProfPic,
                            gender:req.body.gender,
                            email:req.body.email,
                            password:hash,
                         }
                         const schema ={
                            user_id:{type:"string",optional:false,max:30},
                            user_name:{type:"string",optional:false,max:30},
                            email:{type:"string",optional:false,max:30},
                            password:{type:"string",optional:false},
                
                         }
                         const v= new validator();
                         const validatorResponse =v.validate(user,schema);
                         if(validatorResponse !== true){
                            res.status(400).json({
                               message:"validation failed",
                               error:validatorResponse
                            });
                         } 
                         generateTokenAndSetCookie.generateTokenAndSetCookie({email:req.body.email,user_id:userid},res);
                         models.users.create(user).then(result=>{
                            
                          res.status(201).json({
                              message:"user created successfully",
                              result:result
                          })
                         }).catch(error=>{
                            res.status(500).json({
                                message:'something went wrong',
                                error:error
                            });
                         });    
    
                    })//brypt hash
                }); //bcrypt genSalt
                
            }//end of else
        });//end of findone
             
    } catch (error) {
        console.log("error in signin",error)
    }
   
         
}
function login(req,res){
    
    const login ={
        email : req.body.email,
        password :req.body.password
    }
    const schema ={
        email:{type:"string",optional:false},
        password:{type:"string",optional:false}
    }
    const v= new validator();
    const validatorResponse =v.validate(login,schema);
    if(validatorResponse!==true){
        res.status(400).json({
            message:"validation failed",
            error:validatorResponse
         });
    }
    models.users.findOne({where:{email:req.body.email}}).then(userDetails=>{
          if(userDetails ==null){
            res.status(400).json({
                message:"user didnt sign in"
             }); 
            }
             else{
                //console.log("DECODED TOKEN:",req.userData);
                bcryptjs.compare(req.body.password,userDetails.password,function(err,result){
                    if(result === true){
                        const payload = {
                            email: userDetails.email,
                            user_id: userDetails.user_id
                        };
                        // const token =jwt.sign(payload,process.env.JWT_KEY,function(err,token){
                        //     res.status(200).json({
                        //         message:"user logged in successfully",
                        //         token:token
                        //      }); 
                        
                        // })   
                        if(generateTokenAndSetCookie.generateTokenAndSetCookie(payload,res)){
                            res.status(200).json({
                                message:"user logged in successfully"
                            })
                        }
                        
                    }else{
                        res.status(400).json({
                            message:"password didnt match"
                         }); 
                    }
                });
             }
          
    });
}
function logout (req,res){
    try{
        res.cookie("jwt","",{
            maxAge:0
        })
        res.status(200).json({
            message:"logged out successfully"
        })
    }
    catch(error){
         console.log("error while logging out",error)
    }
   
    
}
function updateUser(req,res){
    const userData= req.userData;
    const updateUser={
        user_id:userData.user_id,
        user_name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        balance:req.body.balance
    }
    const schema ={
        user_id:{type:"string",optional:false,max:30},
        user_name:{type:"string",optional:false,max:30},
        email:{type:"string",optional:false,max:30},
        password:{type:"string",optional:false,max:30},
        balance:{type:"number",optional:true}

     }
     const v= new validator();
     const validatorResponse =v.validate(updateUser,schema);
     if(validatorResponse !== true){
        res.status(400).json({
           message:"validation failed",
           error:validatorResponse
        });
     } 
     models.users.findOne({where:{user_id:userData.user_id}}).then(result=>{//should be used as userId
        //console.log(result);
        if(result === null){
            res.status(400).json({
                message:"user id not found"
            });
        } else{
            bcryptjs.genSalt(10,function(error,salt){
                bcryptjs.hash(req.body.password,salt,function(err,hash){
                    models.users.update(
                        {
                            user_name:req.body.name,
                            email:req.body.email,
                            password:hash,
                            balance:req.body.balance
                        },
                        {
                        where:{
                         user_id:userData.user_id
                        }
                        }
                     ).then(result=>{
                        res.status(200).json({
                            message:"user updated successfully"
                        });
                     }).catch(error=>{
                        res.status(500).json({
                            message:"something went wrong"
                        });
                     });
                });//end hash
            });//end gensalt
    }
     });
 
}
/*async function itemsOwned(req,res){
      const id =req.params.id;
      const user = await models.users.findByPk(
        id,
        {include: [models.items_boughts],
      });
      console.log(id)
       res.status(200).json({
        data:user
       });
}
*/

async function buy (req,res){
    const userData =req.userData;
    console.log("userdata:",userData);
    const userEmail =userData.email;
    //console.log("useremail:",userEmail);
    const itemId = await models.item.findOne({where:{item_id:req.params.itemid}});
    console.log("item id is",itemId);
    const user =await models.users.findOne({where:{email:userEmail}});
    //console.log("user balance",user.balance);
    b_price = (itemId.price)*req.body.stock;
    mBalance = (user.balance)-b_price;
    //console.log("total balance",balance);
    if(itemId === null ){
        res.status(400).json({
            message:"no item found"
        });
    }else{
        const itembuy ={
            user_id:user.user_id,
            item_id:req.params.itemid,
            item_name:itemId.item_name,
            price:b_price,
            stock:req.body.stock
        }
        if(mBalance<=0 || null){
            res.status(400).json({
               message:"not enough balance",
               balance :mBalance
            });
        }
        else if(itemId.stock-req.body.stock<=0){
          res.status(400).json({
            message:"no stock left"
          })
        }
        else{

            models.items_bought.create(itembuy).then((result)=>{
                res.status(200).json({
                    message:"item bought successfully",
                    result:result
                })
                models.users.update(
                    {
                        balance:mBalance
                    },
                    {
                    where:{
                     email:userEmail
                    }
                    }
                    
                 );
                }).then(()=>{
                    models.item.update (
                        {
                            stock:itemId.stock-req.body.stock
                        },
                        {
                            where:{
                               item_id:"i2"
                            }
                        }
                     )
                })
               .catch(error=>{
                res.status(500).json({
                    message:"something went wrong while buying",
                    error: error
                 });
    
            });
        }
       
    }
} 

async function profile(req,res){
    const userData = req.userData
    const user = await models.users.findOne({where:{user_id:userData.user_id}});
    const items = await models.items_bought.findAll({where:{user_id:userData.user_id}});
    console.log(user);
    console.log(items);
    if(user.user_id !==null){
        res.status(200).json({
            userData:user,
            yourOrders:items

        });
    }
    if(items.user_id===null){
        res.status(400).json({
            userData:user,
            yourOrders:"didnt purchase any items"
        });
    }

}
module.exports ={
    signin:signin,
    login:login,
    logout:logout,
    update:updateUser,
    buy:buy,
    profile:profile
}