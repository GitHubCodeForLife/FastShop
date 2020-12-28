const productsServices = require('../model/productsServices');
const { ObjectId } = require('mongodb');
const Cart = require('../model/cart');

exports.index = async (req, res, next) => {
     console.log('Products controller index');
     let isProducts = true;
     if (!req.query.id)
          res.render('./product/products', { title: 'Product Page', user: req.user, isProducts: isProducts });
     else {
          let product = await productsServices.findOne({ _id: new ObjectId(req.query.id) });
          res.render('./product/detail', { title: `${product.title} Detail Page`, user: req.user, product: product, isProducts: isProducts });
     }
}
exports.addToCart = async (req, res, next) => {
     var productId = req.query.id;
     var qty = parseInt(req.query.qty);
     var cart = new Cart(req.session.cart ? req.session.cart : {});
     let product = await productsServices.findOne({ _id: new ObjectId(req.query.id) });
     if (qty > 1) {
          cart.addMultiple(product, productId,qty);
     }
     else {    
          cart.add(product, productId);
     }
     req.session.cart = cart;
     console.log(req.session.cart);
     res.redirect('./');
}
