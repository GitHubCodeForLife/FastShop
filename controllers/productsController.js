const productServices = require('../model/productServices');
const { ObjectId} = require('mongodb');

exports.index = async (req, res, next)=>{
      console.log('Products controller index');
      if(!req.query.id)
        res.render('./product/product',{title: 'Product Page'});
       else {
            let product = await productServices.findOne({_id:new ObjectId(req.query.id)});
            res.render('./product/detail',{title: `${product.title} Detail Page`, product: product});
       }
}
