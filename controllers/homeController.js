const userServices = require('../model/userServices');
const productServices = require('../model/productsServices');
const orderServices = require('../model/orderServices');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { ObjectID } = require('mongodb');
const Cart = require('../model/cart');
//Nodemailer
let nodemailer = require('nodemailer');
let { createTransport } = require('../config/nodemailer');
const { use } = require('passport');
let smptTransport = createTransport(nodemailer);


exports.index = async (req, res, next) => {
  console.log('User: ', req.user);
  let isHome = true;
  const newestProducts = await productServices.newestProducts();
  console.log(newestProducts);
  res.render('index', { title: 'FastShop', user: req.user, isHome: isHome, newestProducts });
}

exports.signup = (req, res, next) => {
  res.render('user/signup', { title: 'Signup Page' });
}

exports.login = (req, res, next) => {
  res.render('user/login', { title: 'Login Page', message: req.message, verifyEmailSuccess: req.flash('verifyEmailSuccess'), resetPasswordSuccess: req.flash('resetPasswordSuccess') });
}

exports.cart = (req, res, next) => {
  let isCart = true;
  if (!req.session.cart) {
    return res.render('cart', { title: 'Cart', user: req.user, isCart: isCart, products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', { title: 'Cart', user: req.user, isCart: isCart, products: cart.generateArray(), sum: cart.totalPrice });
}
exports.increaseByOne = (req, res, next) => {
  var productId = req.query.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.json(cart);
}
exports.decreaseByOne = (req, res, next) => {
  var productId = req.query.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.decreaseByOne(productId);
  req.session.cart = cart;
  res.json(cart);
}
exports.removeItem = (req, res, next) => {

  var productId = req.query.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  console.log("IMMM HERE");
  req.session.cart = cart;
  res.json(cart);
}

exports.checkout = (req, res, next) => {
  isCart = true;
  var cart = new Cart(req.session.cart);
  res.render('checkout', { title: 'Checkout', user: req.user, isCart: isCart, products: cart.generateArray(), sum: cart.totalPrice, name: req.user.CUS_NAME, phone: req.user.CUS_PHONE, address: req.user.CUS_ADDRESS });
}

exports.postSignup = async (req, res, next) => {
  console.log(req.body);
  let errors = [];
  let { email, password, retype_password, name, phone, address } = req.body;
  let infor = req.body;
  //console.log(infor.email);
  // Check valid Infor 
  if (password == '') {
    errors.push('Password is invalid');
    console.log('Password is invalid');
  }
  if (password != retype_password) {
    errors.push('Password is not match together');
    console.log('Password is not match together');
  }
  if (password.length < 6) {
    errors.push('Password is at least 6 characters');
    console.log('Password is at least 6 characters');
  }
  if (errors.length > 0) {
    res.render('user/signup', { title: 'Signup Page', errors, infor: infor });
    return;
  }

  //check email exist & verified
  let user = await userServices.findOne({ CUS_EMAIL: email });
  if (user != null) {
    if (user.IS_VERIFIED == true) {
      errors.push('Email has registered. Please use another email.')
      res.render('user/signup', { title: 'signup Page', errors, infor: infor });
    } else {
      //update user
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) throw err;
        let tempUser = {
          CUS_EMAIL: email,
          PASSWORD: hash,
          CUS_NAME: name,
          CUS_PHONE: phone,
          CUS_ADDRESS: address,
          IS_VERIFIED: false,
          IS_LOCK: false,
          PASSWORD_RESET_EXPIRES: Date.now()
        };
        let mailOptions = {
          from: `"Fast Shop" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Verifiy Email',
          html: `<a href = '${process.env.URL_WEB}/api/auth/verification/verify-account/${user._id}/${process.env.SCRETCODE}'><h1>Click here to verify your email</h1></a>`
        };
        await userServices.updateOne({ _id: user._id }, { $set: tempUser });
        //Send email
        smptTransport.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.send('Please check mail to verify your account');
          }
        });
      });

    }
  } else {
    // save into database
    //hash password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) throw err;
      let tempUser = {
        CUS_EMAIL: email,
        PASSWORD: hash,
        CUS_NAME: name,
        CUS_PHONE: phone,
        CUS_ADDRESS: address,
        IS_VERIFIED: false,
        IS_LOCK: false,
        PASSWORD_RESET_EXPIRES: Date.now()
      };
      await userServices.insertOne(tempUser);
      user = await userServices.findOne(tempUser);
      let mailOptions = {
        from: `"Fast Shop" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify email',
        html: `<a href = '${process.env.URL_WEB}/api/auth/verification/verify-account/${user._id}/${process.env.SCRETCODE}'><h1>Click here to verify your email</h1></a>`
      };
      //Send email
      smptTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send('Please check mail to verifi');
        }
      });
    });

  }

}

exports.getForgetPassword = async (req, res, next) => {
  res.render('user/forgetPassword', { title: 'Forget profile' });
}
exports.postForgetPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  //Check Email exist
  const user = await userServices.findOne({ CUS_EMAIL: email });
  //let error;
  if (!user) {
    res.render('user/forgetPassword', { title: 'Forget password', error: "Email has not been registered." });
    return;
  }
  //Check account IS_LOCK
  if (user.IS_LOCK == true) {
    res.render('user/forgetPassword', { title: 'Forget password', error: "Your account was locked" });
    return;
  }
  //Send Email to your accout
  const code = makeCode(26);
  const id = user._id;
  //Save Code on database
  await userServices.updateOne(user, { $set: { CODE: code, DATE_CODE_EXPRIRE: Date.now() } });
  //rand dom an code
  let mailOptions = {
    from: `"Fast Shop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Set new password',
    html: `<a href = '${process.env.URL_WEB}/password-reset/${code}${id}'><h1>Click here to reset your password</h1></a>`

  };
  //Send email
  smptTransport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Please check your mail to reset password.');
    }
  });
}
exports.resetPassword = async (req, res, next) => {
  const { total } = req.params;
  if (total.length < 26) {
    res.send('This link is invalid');
    return;
  }
  const code = total.substring(0, 26);
  const id = total.substring(26, total.length);
  console.log(id, code);
  //find user
  const user = await userServices.findOne({ _id: ObjectID(id), CODE: code });
  if (!user) {
    res.send('This link is invalid');
    return;
  }
  res.render('user/resetPassword', { title: 'Reset Password' });
}
exports.postResetPassword = async (req, res, next) => {
  const { total } = req.params;
  if (total.length < 26) {
    res.send('This link is invalid');
    return;
  }
  let code = total.substring(0, 26);
  const id = total.substring(26, total.length);
  console.log(id, code);
  //find user
  const user = await userServices.findOne({ _id: ObjectID(id), CODE: code });
  if (!user) {
    res.redirect('/forgetPassword');
    return;
  }
  let errors = [];
  const { password, retype_password } = req.body;

  if (password.length < 6) {
    errors.push('Password is at least 6 characters');
    res.render('user/resetPassword', { title: 'Reset Password', errors });
    return;
  }
  if (password != retype_password) {
    errors.push('Password is not match together');
    res.render('user/resetPassword', { title: 'Reset Password', errors });
    return;
  }
  //update user
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) throw err;
    code = makeCode(26);
    console.log(code);
    await userServices.updateOne(user, { $set: { CODE: code, PASSWORD: hash } });
    await req.flash('resetPasswordSuccess', 'true');
    res.redirect('/login');
  });
}
function makeCode(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

