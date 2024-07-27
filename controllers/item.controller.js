const { response } = require('express');
const models = require('../models');
const crypto = require("crypto");
async function update(req,res){
    const itemid = req.params.itemid;
    const sellerData = req.userData;
    // s_id: DataTypes.STRING,
    // item_id: DataTypes.STRING,
    // item_name: DataTypes.TEXT,
    // price: DataTypes.INTEGER,
    // stock: DataTypes.INTEGER
    const finditem = await models.item.findOne({ where: { item_id: req.params.itemid } });
    console.log("itemound",finditem);
    console.log("sellerdet",sellerData.s_id);
    console.log("itemid params", finditem.s_id);
    if(finditem !== null){
        if(finditem.s_id === sellerData.s_id ){
            models.item.update({
                s_id:sellerData.s_id,
                item_id:req.params.itemid,
                item_name:req.body.itemname,
                price:req.body.price,
                stock:req.body.stock
            },
            {
            where:{
             item_id:req.params.itemid
            }
            }
         ).then(result=>{
            res.status(200).json({
                message:"item updated successfully",
                result:result
            });
         }).catch(err=>{
            res.status(404).json({
                message:"something went wrong"
            });
         });
        
        } else{
            res.status(200).json({
              message:'unauthorized access'
            });
        }
    }else{
        res.status(400).json({
            message:"item not found"
        });
    }
}
async function pdelete(req,res){
    const itemid = req.params.itemid;
    const sellerData = req.userData;
    const finditem = await models.item.findOne({ where: { item_id: req.params.itemid } });
    console.log("itemound",finditem);
    console.log("sellerdet",sellerData.s_id);
    if(finditem !== null){
        if(finditem.s_id === sellerData.s_id ){
           models.item.destroy({where:{item_id:req.params.itemid}}).then(result=>{
            res.status(201).json({
                message:"item deleted successfully"
            });
           }).catch(err=>{
            res.status(500).json({
                message:"something went wrong"
            });
           });
        } else{
            res.status(200).json({
              message:'unauthorized access'
            });
        }
    }else{
        res.status(400).json({
            message:"item not found"
        });
    }
}
async function show(req,res){
        const items= await models.item.findAll();
        res.status(200).json({
            items:items
        });

 }   
 async function singleItem(req,res){
    const item = await models.item.findOne({where:{item_id:req.params.itemid}})
    const itemSeller =await models.sellers.findOne({where:{s_id:item.s_id}});
    res.status(200).json({
        item:item,
        soldby:itemSeller
       })
}
 function comments (req,res){
    const custID =req.userData.s_id || req.userData.user_id;
    console.log("customer id is",custID);
    let uuid =crypto.randomUUID();

    let appendedC = "c-" +uuid;
   
    let commentId = appendedC.substring(0,9);
   
    const addComment ={
        item_id: req.params.itemid,
       customer_id: custID,
       customer_name:req.userData.sname|| req.userData.email,
       comment_id:commentId,
       comment:req.body.comment
    }
    // const addComment ={
    //     itemId: "li",
    //    customerId: "s1",
    //    customerName:"hello",
    //    comments:req.body.comments
    // }
    models.comments.create(addComment).then((result)=>{
        res.status(200).json({
            message:"comment added succesfully",
            result:result
        })
    }).catch(err=>{
        res.status(400).json({
            message:"something went wrong",
            err:err
        })
    })

}
function getcomments(req,res){
    models.comments.findAll({where:{item_id:req.params.itemid}}).then(result=>{
        res.status(200).json({
            message:"comments are",
            result:result
        })
    }).catch(err=>{
        res.status(400).json({
            message:"something went wrong",
            error:err
        })
    })
}
function deleteComment (req,res){
    models.comments.destroy({where:{item_id:req.params.commentId}}).then(result=>{
        res.status(200).json({
            message:"comment deleted successfully",
            result:result
        })
    }).catch(err=>{
        res.status(400).json({
            message:"error while deleting",
            error:err
        })
    })
}
async function addToCart(req,res){
    const userdata = req.userData;
    console.log("userData is",userdata);
    const itemId =req.params.itemId;
    try{
        const itemDet = await models.item.findOne({where:{
            item_id:itemId
        }})
        console.log("item details is",itemDet.dataValues.item_name);
        const cartitem ={
            item_id:req.params.itemId,
            user_id:userdata.user_id,
            item_name:itemDet.dataValues.item_name
        }
        
        models.Cart.create(cartitem).then(result=>{
            res.status(200).json({
                message:"added to cart",
                result:result
            })
        }).catch(err=>{
            res.status(400).json({
                message:"somthing went wrong",
                error:err
            })
        })
    }catch(err){
        res.json({
            erroris:err
        })
    }
   
  
   
}
module.exports ={
    update:update,
    delete:pdelete,
    show:show,
    singleItem:singleItem,
    comments:comments,
    getcomments:getcomments,
    deleteComment:deleteComment,
    addToCart:addToCart
}
