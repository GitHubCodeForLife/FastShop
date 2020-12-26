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

exports.updateOne = async(user, newValue)=>{
    console.log('Update user');
    await db().collection('users').updateOne(user, newValue);
}
