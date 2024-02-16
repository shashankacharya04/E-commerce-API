const { response } = require('express');
const models = require('../models');
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
module.exports ={
    update:update,
    delete:pdelete,
    show:show,
    singleItem:singleItem
}
