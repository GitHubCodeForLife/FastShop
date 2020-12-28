const {db} = require('../database/db');
const { ObjectId} = require('mongodb');

exports.products = async(page, perPage)=>{
    console.log('Products Collection');
    const products = await db().collection('products').find({}).limit(perPage).skip((page-1)*perPage).toArray();
    //pages =  await productsCollection.find({}).count()/perPage;
    return products;
}

exports.findOne = async(product)=>{
    const ans = await db().collection('products').findOne(product);
    return ans;
}

exports.searchProducts = async(query)=>{
    return await db().collection('products').find(query).toArray();
}
