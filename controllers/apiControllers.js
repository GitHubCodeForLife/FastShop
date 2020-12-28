
const productServices = require('../model/productsServices');
const userServices = require('../model/userServices');
const { ObjectId} = require('mongodb');


exports.index = (req, res, next)=>{
      console.log('Index API');
      res.send('API');
  }

exports.products = async (req, res, next)=>{
    let page = req.query.page || 1;
    if(page<=0){
        page = 1;
    }
    let perPage = 9;
    let products = await productServices.products(page,perPage);
    res.json(products);

}
exports.verifyEmail = async(req, res, next)=>{
  const { userId, secretCode } = req.params;
  console.log(req.params);
    console.log(secretCode);
   //Check Scret
   if(secretCode!=process.env.SCRETCODE){
       res.send('Verify failed, because scretcode is not correct');return;
   }
   //Find User
//    if(userId.length!=12){
//        res.send('Verify failed, because lenght of UserID');return;
//    }
   let user = await userServices.findOne({_id: new ObjectId(userId)});
   if(!user){
    res.send('Verify failed, because do not find out user');return;
   }
   //Check verify   
   if(user.isVerified){
    res.send('Verify failed, because User has verified.');return;
   }
   //update User
   await userServices.updateOne({_id: new ObjectId(userId)},{$set:{isVerified: true}})

    res.send('Verify Success');
}