const { db } = require('../database/db');
const { ObjectId } = require('mongodb');
exports.findOne = async (promo) => {
    console.log('Find one');
    const ans = await db().collection('PROMO').findOne(promo);
    return ans;
}
exports.getAll = async()=>{
    console.log('Get All');
    return await db().collection('PROMO').find({ACTIVE: true}).toArray();
}



