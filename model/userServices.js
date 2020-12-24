const {db} = require('../database/db');
const { ObjectId} = require('mongodb');

exports.findOne = async(user)=>{
    console.log('Find one');
    const ans =  await db().collection('users').findOne(user);
    return ans;
}

exports.insertOne = async(user)=>{
    console.log('Insert One');
    await db().collection('users').insertOne(user);
}