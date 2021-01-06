const userServices = require('../model/userServices');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.dashboard = async (req, res, next) => {
    res.render('user/dashboard', { title: 'Dashboard', user: req.user, updatePasswordsuccess: req.flash('updatePasswordsuccess'), editProfileSuccess: req.flash('editProfileSuccess') });
}

exports.getEditProfile = async (req, res, next) => {
    res.render('user/editProfile', { title: 'Edit profile', user: req.user });
}

exports.postEditProfile = async (req, res, next) => {
    const { name, phone, address, birthDay } = req.body;
    console.log(req.user);
    //update
    await userServices.updateOne({ _id: ObjectId(req.user._id) }, { $set: { CUS_NAME: name, CUS_PHONE: phone, CUS_ADDRESS: address, BIRTHDAY: new Date(birthDay) } });
    await req.flash('editProfileSuccess', 'true');
    res.redirect('/users/dashboard');
}
exports.getChangePassword = async (req, res, next) => {
    res.render('user/changePassword', { title: 'Change Password', user: req.user });
}
exports.postChangePassword = async (req, res, next) => {
    console.log(req.body);
    const { current_password, new_password, retype_password } = req.body;
    let errors = [];
    //Check valid
    if (new_password.length < 6) {
        errors.push('Password is at least 6 characters.');
    }
    if (new_password != retype_password) {
        errors.push('Password is not match together')
    }
    if (errors.length > 0) {
        res.render('user/changePassword', { title: 'Change Password', user: req.user, errors: errors });
        return;
    }
    //Check Current password
    bcrypt.compare(current_password, req.user.PASSWORD, async (err, result) => {
        if (err) throw err;
        if (result) {
            //Update password
            bcrypt.hash(new_password, saltRounds, async (err, hash) => {
                if (err) throw err;
                await userServices.updateOne(req.user, { $set: { PASSWORD: hash } });
                //save into flash 
                await req.flash('updatePasswordsuccess', 'true');
                //  res.render('user/changePassword',{title: 'Change Password',user: req.user, updateSuccess: true});
                res.redirect('/users/dashboard');
            });
        } else {
            errors.push('Current password is incorrect.');
            res.render('user/changePassword', { title: 'Change Password', user: req.user, errors: errors });
            return;
        }
    });

}
