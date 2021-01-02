const productsServices = require('../model/productsServices');
const userServices = require('../model/userServices');
const commentServices = require('../model/commentServices');
const { ObjectId } = require('mongodb');


exports.index = (req, res, next) => {
    console.log('Index API');
    res.send('API');
}

exports.products = async (req, res, next) => {
    let page = req.query.page || 1;
    if (page <= 0) {
        page = 1;
    }
    let perPage = 9;
    const products = await productsServices.products(page, perPage);
    console.log(products);
    res.json(products);

}

exports.verifyEmail = async (req, res, next) => {
    const { userId, secretCode } = req.params;
    console.log(req.params);
    console.log(secretCode);
    //Check Scret
    if (secretCode != process.env.SCRETCODE) {
        res.send('Verify failed, because scretcode is not correct'); return;
    }
    //Find User
    //    if(userId.length!=12){
    //        res.send('Verify failed, because lenght of UserID');return;
    //    }
    let user = await userServices.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        res.send('Verify failed, because do not find out user'); return;
    }
    //Check verify   
    if (user.IS_VERIFIED) {
        res.send('Verify failed, because User has verified.'); return;
    }
    //update User
    await userServices.updateOne({ _id: new ObjectId(userId) }, { $set: { IS_VERIFIED: true } })
    await req.flash('verifyEmailSuccess','true');
    res.redirect('/login');
}

exports.searchProducts = async (req, res, next) => {
    const { q, page } = req.query;
    console.log(q);
    console.log(page);
    let products = await productsServices.searchProducts({ $text: { $search: q } }, page || 1);
    console.log(products);
    res.json(products);
}

exports.getComment = async (req, res, next) => {
    const { product_id } = req.params;
    const { page } = req.query;
    console.log(product_id);
    const comments = await commentServices.find({ DISH_ID: product_id }, page, 2);  
    res.json(comments);
}

exports.postComment = async (req, res, next) => {
    const { product_id } = req.params;
    console.log(product_id);
    const { name, message } = req.body;
    console.log(name, message);
    await commentServices.insert({ REVIEWER: name, CONTENT: message, DISH_ID: product_id });
    res.json(['a', 'b']);
}
