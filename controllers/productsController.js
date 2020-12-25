const productServices = require('../model/productsServices');
const { ObjectId} = require('mongodb');

exports.index = async (req, res, next)=>{
      console.log('Products controller index');
      let isProducts = true;
      if(!req.query.id)
        res.render('./product/products',{title: 'Product Page',isProducts: isProducts});
       else {
            let product = await productServices.findOne({_id:new ObjectId(req.query.id)});
            res.render('./product/detail',{title: `${product.title} Detail Page`, product: product,isProducts: isProducts});
       }
}
