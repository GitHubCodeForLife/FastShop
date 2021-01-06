const promotionServices = require('../model/promotionServices');
exports.index = async(req, res, next)=>{
    const promotions = await promotionServices.getAll();
    console.log(promotions);
    res.render('promotion',{title: 'Promotion Page', promotions: promotions});
}