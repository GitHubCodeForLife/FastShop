const productsServices = require('../model/productsServices');
const { ObjectId } = require('mongodb');
const Cart = require('../model/cart');

exports.index = async (req, res, next) => {
     const products = await productsServices.products(1, 9);
     res.render('./product/products', { title: 'Product Page', user: req.user, isProducts: true, products: products });
}
exports.addToCart = async (req, res, next) => {
     var productId = req.query.id;
     var qty = parseInt(req.query.qty);
     var cart = new Cart(req.session.cart ? req.session.cart : {});
     let product = await productsServices.findOne({ _id: new ObjectId(req.query.id) });
     if (qty > 1) {
          cart.addMultiple(product, productId, qty);
     }
     else {
          cart.add(product, productId);
     }
     req.session.cart = cart;
     console.log(req.session.cart);
     res.send();
}

exports.search = async (req, res, next) => {
     const { q } = req.query;
     const products = await productsServices.searchProducts({ $text: { $search: q } }, 1);
     console.log('Seach Products: ', products);
     let isPaging = true;
     isPaging = products[8] == undefined ? false : true;
     const pageTwoProducts = await productsServices.searchProducts({ $text: { $search: q } }, 2);
     isPaging = pageTwoProducts[0] == undefined ? false : true;
     const pageThreeProducts = await productsServices.searchProducts({ $text: { $search: q } }, 3);
     pageThree = pageThreeProducts[0] == undefined ? false : true;
     console.log("Page three: ", pageThree);
     res.render('./product/search', { title: 'Search product Page', user: req.user, products: products, isPaging, pageThree });
}
exports.type = async (req, res, next) => {
     const type_products = ['pizza', 'drink', 'burger', 'spaghetti', 'dessert', 'rice'];
     //console.log(req.params);
     const Type = req.params.type;
     if (!type_products.includes(Type)) {
          res.sendStatus(404);
          return;
     }
     const products = await productsServices.findProducts({ TYPE: Type }, 1, 9);
     isPaging = products[8] == undefined ? false : true;
     const pageTwoProducts = await productsServices.findProducts({ TYPE: Type }, 2, 9);
     isPaging = pageTwoProducts[0] == undefined ? false : true;
     const pageThreeProducts = await productsServices.findProducts({ TYPE: Type }, 3, 9);
     pageThree = pageThreeProducts[0] == undefined ? false : true;
     console.log(products);
     res.render('./product/type', { title: `${Type} Page`, user: req.user, products: products, isPaging, pageThree })
};
exports.detailPage = async (req, res, next) => {
     const { id } = req.query;
     let product = await productsServices.findOne({ _id: new ObjectId(req.query.id) });
     console.log(product);
     //Upload view
     await productsServices.updateOne({ _id: new ObjectId(id) }, { $set: { VIEW: product.VIEW + 1 } });
     //Find related 
     const relatedProducts = await productsServices.findRelatedProducts(product);
     let first = []; let second = []; let third = [];
     first.push(relatedProducts[0]); first.push(relatedProducts[1]); first.push(relatedProducts[2]);
     second.push(relatedProducts[3]); second.push(relatedProducts[4]); second.push(relatedProducts[5]);
     third.push(relatedProducts[6]); third.push(relatedProducts[7]); third.push(relatedProducts[8]);

     const newProducts = await productsServices.newestProducts();

     res.render('./product/detail', {
          title: `${product.DISH_NAME} Detail Page`, user: req.user, product: product,
          first, second, third, firstNewProduct: newProducts[0], secondNewProduct: newProducts[1],
          thirdNewProduct: newProducts[2]
     });
}

