const orderServices = require('../model/orderServices');
const { ObjectId } = require('mongodb');


module.exports = {
    setUpNotification: async function (req, res, next) {
        if (req.user != undefined) {
            //Number of notification 
            const orders = await orderServices.findOrders(req.user._id);
            const results = orders.filter(order => {
                const current = new Date(Date.now());
                const dateCreate = order.DATECREATED;
                //console.log(current + '\n' + dateCreate);
                if (current.getDate() == dateCreate.getDate() && current.getMonth() == dateCreate.getMonth() && current.getFullYear() == dateCreate.getFullYear()) {
                    //console.log('OKe');
                    return true;
                }
                return false;
            });
            console.log('Orders in day: ', results);
            if (results.length > 0) {
                //Infor to display
                req.user.notification = results;
                console.log(req.user.notification);
                //res.user.notification.length = results.length;
            }
            console.log('setup notification ')
        }

        next();
    }

};