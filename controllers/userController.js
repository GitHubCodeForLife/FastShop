const userServices = require('../model/userServices');
const { ObjectId } = require('mongodb');
exports.dashboard = async (req, res, next) => {
    res.render('user/dashboard', { title: 'Dashboard', user: req.user});
}

exports.getEditProfile = async (req, res, next) => {
    res.render('user/editProfile', { title: 'Edit profile', user: req.user });
}

exports.postEditProfile = async(req, res, next)=>{
    const {name, phone, address}=   req.body;
    console.log(req.user);
    //update
    await userServices.updateOne({_id: ObjectId(req.user._id)}, {$set:{CUS_NAME: name,CUS_PHONE: phone, CUS_ADDRESS: address}});
    res.redirect('/users/dashboard');
}
exports.getChangePassword = async(req, res, next)=>{
    res.render('user/changePassword', { title: 'Change profile', user: req.user });
}
