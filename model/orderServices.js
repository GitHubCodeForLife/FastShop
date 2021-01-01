const { db } = require('../database/db');
const { ObjectId } = require('mongodb');
const Cart = require('../model/cart');
exports.placeOrder = async (order, items , fn) => {
    await db().collection('ORDER').insertOne(order, async function (err, res) {
        if (err) throw err;
        console.log("1 document inserted", res.insertedId);
        orderId = res.insertedId;
        var orderDetails =[];
        for (i in items) {
            var temp = {
                ORDER_ID: orderId.toString(),
                DISH_ID: items[i].item._id,
                QUANTITY2: items[i].qty,
                SUBTOTAL: items[i].price
            }
            orderDetails.push(temp);
        }
        await db().collection('ORDER_DETAIL').insertMany(orderDetails);
        fn(orderId.toString()); 
    });
}
async function insertOrderDetails(orderId,items){

        console.log('orderId',orderId.toString());
}

exports.findOrders = async (userId) => {
    return await db().collection('ORDER').find({CUS_ID : userId}).toArray();
}

exports.findOneOrder = async (orderId) => {
    order = await db().collection('ORDER').findOne({_id: new ObjectId(orderId) });
    return order;
}

exports.findOrderDetail = async (orderId) => {
    return await db().collection('ORDER_DETAIL').find({ORDER_ID : orderId}).toArray();
}

exports.cancel = async (orderId) => {
    var myquery =  {_id : new ObjectId(orderId)};
    var newvalues = { $set: {STATUS : -1} };
    db().collection('ORDER').updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 order canceled");
    });
}