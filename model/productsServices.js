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
        STATUS: 1,
        TYPE: 1,
        IMAGES: 1,
        score: { $meta: "textScore" },
        VIEW: 1
    };
    return await db().collection('DISH').find(query).sort(sort).project(projection).limit(9).skip((page - 1) * 9).toArray();
}

exports.findProducts = async (query, page, perPage) => {
    console.log('Find products');
    const products = await db().collection('DISH').find(query).limit(perPage).skip((page - 1) * perPage).toArray();
    return products;
}

exports.updateOne = async (product, newValue) => {
    console.log('Update DISH');
    await db().collection('DISH').updateOne(product, newValue);
}
exports.findRelatedProducts = async (product) => {
    console.log('Find related Products');
    const relatedProducts = await db().collection('DISH').find({ TYPE: product.TYPE }).limit(9).toArray();
    return relatedProducts;
}

//Newest products
exports.newestProducts = async () => {
    // define an empty query document
    // sort in descending (-1) order by length
    const sort = { DATECREATED: -1 };
    const products = await db().collection('DISH').find({}).sort(sort).limit(4).toArray();
    return products;
}