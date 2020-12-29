const { db } = require('../database/db');
const { ObjectId } = require('mongodb');

exports.find = async (key, page, perPage) => {
  console.log('Find commnents');
  const ans = await db().collection('comments').find(key).limit(perPage).skip((page - 1) * perPage).toArray();
  return ans;
}

exports.insert = async (key) => {
  await db().collection('comments').insertOne(key);
}    