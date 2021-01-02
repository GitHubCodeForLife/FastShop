const { db } = require('../database/db');
const { ObjectId } = require('mongodb');

exports.products = async (page, perPage) => {
    console.log('Products Collection');
    const products = await db().collection('DISH').find({}).limit(perPage).skip((page - 1) * perPage).toArray();
    //pages =  await productsCollection.find({}).count()/perPage;
    return products;
}

exports.findOne = async (product) => {
    const ans = await db().collection('DISH').findOne(product);
    return ans;
}

exports.searchProducts = async (query, page) => {
//    const sort = { DISH_NAME: 1 };
    const sort = { score: { $meta: "textScore" } };
    const projection = {
        _id: 1,
        DISH_NAME: 1,
        PRICE: 1,
        IMAGE: 1,
        score: { $meta: "textScore" }
      };
    return await db().collection('DISH').find(query).sort(sort).project(projection).limit(9).skip((page - 1) * 9).toArray();
}   
