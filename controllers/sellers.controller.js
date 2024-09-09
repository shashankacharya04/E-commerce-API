const models = require('../models');
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const validator =require('fastest-validator');
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const cloudinary = require ('cloudinary').v2;
const {v4:uuid} =require("uuid")
async function signin(req,res){
    const randomval = uuid()
    const sid = "S" + randomval.substring(0,8);
    const sellerDet= await models.sellers.findOne({where:{s_name:req.body.sname}});
    console.log("seller det uis",sellerDet)
    console.log('sellerdetails:',sellerDet)
    if(sellerDet !== null){
        res.status(400).json({
            message:"user already exists"
        });
    } else{
        let reqProfPic
    if(req.body.profile_pic=="" || req.body.profile_pic== null){
         reqProfPic = "https://avatar.iran.liara.run/public/job/operator/male"
    } else{
        // console.log("req.body",req.body.profile_pic)
      data=await cloudinary.uploader.upload(req.body.profile_pic) ;
      console.log("req prof pic is",data)
      reqProfPic= data.secure_url;
      

    }
        bcrypt.genSalt(10,function(error,salt){
            bcrypt.hash(req.body.password,salt,function(error,hash){
                const seller ={
                    s_id:sid,
                    profile_pic:reqProfPic,
                    s_name:req.body.sname,
                    email:req.body.email,
                    password:hash
                 }
                 const schema ={
                    s_id:{type:"string",optional:false,max:30},
                    profile_pic:{type:"string",optional:false},
                    s_name:{type:"string",optional:false,max:30},
                    email:{type:"string",optional:false},
                    password:{type:"string",optional:false}
                 }
                 const v= new validator();
                 const validatorResponse =v.validate(seller,schema);
                 if(validatorResponse !== true){
                    res.status(400).json({
                       message:"validation failed",
                       error:validatorResponse
                    });
                 } 
                 generateTokenAndSetCookie.generateTokenAndSetCookie({s_id:sid,
                    s_name:req.body.sname},res)
                 models.sellers.create(seller).then(result=>{
                  res.status(201).json({
                      message:"logged in as seller",
                      result:result
                  });
                 }).catch(error=>{
                    res.status(500).json({
                        message:'something went wrong',
                        error:error
                    });
                 });
            });//end hash
        });//end salt
        
        
         

    }//end else
         
}
 async function login(req,res){
    const slogin ={
        sname : req.body.sname,
        password :req.body.password
    }
    const schema ={
        sname:{type:"string",optional:false},
        password:{type:"string",optional:false}
    }
    const v= new validator();
    const validatorResponse =v.validate(slogin,schema);
    if(validatorResponse!==true){
        res.status(400).json({
            message:"validation failed",
            error:validatorResponse
         });
    }
    const loginDet =await models.sellers.findOne({where:{s_name:req.body.sname}});
    if(loginDet === null){
        res.status(400).json({
            message:"user didnt sign in"
         });
    }else{
    bcrypt.compare(req.body.password,loginDet.password,function(err,result){
        if(result === true){
            const payload ={
               s_id:loginDet.s_id,
               s_name:loginDet.s_name 
            };
            if(generateTokenAndSetCookie.generateTokenAndSetCookie(payload,res)){
                res.status(200).json({
                    message:"user logged in successfully",
                 });
            }

            // jwt.sign(payload,process.env.JWT_KEY,function(err,token){
            //     res.status(200).json({
            //         message:"user logged in successfully",
            //         sellerToken:token
            //      });
            // });
        }else{
            res.status(400).json({
                message:"invalid username/password"
             });
        }
    });
    }//end of else
}
function updateUser(req,res){
    const sellerData = req.userData;
    const updateSeller={
            s_name:req.body.sname,
            password:req.body.password,
    }
    const schema ={
        s_name:{type:"string",optional:false,max:30},
        password:{type:"string",optional:false,max:30},

     }
     const v= new validator();
     const validatorResponse =v.validate(updateSeller,schema);
     if(validatorResponse !== true){
        res.status(400).json({
           message:"validation failed",
           error:validatorResponse
        });
     } 
     models.sellers.findOne({where:{s_id:sellerData.s_id}}).then(result=>{// should be s_id from token
        console.log(result);
        if(result === null){
            res.status(400).json({
                message:"couldnt find id"
            });
        } else{
            bcrypt.genSalt(10,function(err,salt){
                bcrypt.hash(req.body.password,salt,function(error,hash){
                    models.sellers.update(
                        {
                            s_name:req.body.sname,
                            password:hash,
                        },
                        {
                        where:{
                         s_id:sellerData.s_id// should be s_id from token
                        }
                        }
                     ).then(result=>{
                        res.status(200).json({
                            message:"seller updated successfully"
                        });
                     }).catch(error=>{
                        res.status(500).json({
                            message:"something went wrong"
                        });
                     });
                })//end hash
            })//end salt
        
            
    }//end else
     });
 
}
async function additem(req,res){
    const sellerData =req.userData
    
    console.log("sellerdata",sellerData);
    const randomval = uuid()
    const itemId = "I" + randomval.substring(0,8);
    // const itemImage = req.body.itemImage;
    // console.log("itemIMage",itemImage);
    // const img = await cloudinary.uploader.upload(itemImage);
    // console.log("image after",img);
    const itemImage = req.body.itemImage;
    const item_image = await cloudinary.uploader.upload(itemImage);
    const additem ={
            s_id:sellerData.payload.s_id,
            item_id:itemId,
            item_name:req.body.itemname,
            price:req.body.price,
            stock:req.body.stock
    }
    const schema ={
        item_id:{type:"string",optional:true,max:10},
        item_image:{type:"string",optional:true,max:10000},
        item_name:{type:"string",optional:true,max:30},
        price:{type:"number",optional:true,max:20000},
        stock:{type:"number",optional:true}
     }
     const v= new validator();
     const validatorResponse =v.validate(additem,schema);
     if(validatorResponse !== true){
        res.status(400).json({
           message:"validation failed",
           error:validatorResponse
        });
     } else{
      additem.item_image = item_image.secure_url
        models.item.create(additem).then(result=>{
            console.log(result)
            res.status(200).json({
                   message:"item added successfully"
            });
         }).catch(error=>{
            res.status(500).json({
                message:"something went wrong"
         });
         })
     }
    


}
function itemSold(req,res){
    const sellerdetails =req.userData;
    models.item.findAll({where:{
        s_id:req.params.sellerId
    }}).then(result=>{
        res.status(200).json({
          message:`items of ${sellerdetails.s_name} is`,
          items:result
        })
    }).catch(err=>{
        res.status(400).json({
            message:"something went wrong",
            err:err
        })
    })

}
module.exports ={
    signin:signin,
    login:login,
    update:updateUser,
    additem:additem,
    itemSold:itemSold
}