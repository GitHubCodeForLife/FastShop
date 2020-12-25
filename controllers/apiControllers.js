const productServices = require('../model/productsServices');

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