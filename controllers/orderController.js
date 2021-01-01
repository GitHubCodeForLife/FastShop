const orderServices = require('../model/orderServices');
const productsServices = require('../model/productsServices');
const Cart = require('../model/cart');
const { ObjectId } = require('mongodb');


exports.placeOrder = async(req, res, next) => {
    var cart = new Cart(req.session.cart);
    const info =   req.body;
    var order = {
      CUS_ID : req.user._id.toString(),
      STAFF_ID : '',
      DATECREATED: Date(Date.now()),
      STATUS : 0,
      TOTAL : cart.totalPrice,
      NAME : info.name,
      PHONE : info.phone,
      ADDRESS : info.address,
      TIME: info.time,
      NOTE: info.note
    }
    const items = cart.generateArray();
    await orderServices.placeOrder(order,items ,function(orderId){
        req.session.cart = new Cart({});
        res.redirect('/users/order-history/details?id=' + orderId);
    });
}

exports.orderHistory = async(req, res, next)=>{
    var history = [];
    const historyItems = await orderServices.findOrders(req.user._id.toString());
    for (i in historyItems){;
        var temp =[];
        let details = await orderServices.findOrderDetail(historyItems[i]._id.toString());
        for (j in details){
            product = await productsServices.findOne({_id : new ObjectId(details[j].DISH_ID)});
            temp.push({image:product.IMAGE,qty:details[j].QUANTITY2})
        }
        history.push({historyItem : historyItems[i], imgQty : temp});
    }
    history.reverse();
    res.render('user/orderHistory', {title: 'Order History', user :req.user, history: history});
}

exports.orderDetails = async(req, res, next)=>{
    const id = req.query.id;
    const order = await orderServices.findOneOrder(id);
    const details = await orderServices.findOrderDetail(order._id.toString());
    var orderItems = [];
    for (i in details) {
        product = await productsServices.findOne({_id : new ObjectId(details[i].DISH_ID)});
        orderItems.push({details : details[i], item : product});
    }
    res.render('user/orderDetails',{title: 'Order History', user :req.user, order : order, orderItems: orderItems});
}

exports.orderCancel = async(req, res, next)=>{
    const id = req.query.id;
    await orderServices.cancel(id);
    res.redirect('/users/order-history/details?id=' + id);
}