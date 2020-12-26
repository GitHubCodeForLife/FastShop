const userServices = require('../model/userServices');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { ObjectID } = require('mongodb');
//Nodemailer
let nodemailer = require('nodemailer');
let {createTransport} = require('../config/nodemailer');
let smptTransport = createTransport(nodemailer);


exports.index = (req, res, next)=>{
  console.log('User: ', req.user);
  let isHome = true;
    res.render('index', { title: 'FastShop' , user: req.user, isHome: isHome});
}

exports.signup =(req, res, next)=> {
    res.render('user/signup',{title: 'Signup Page'});
}

exports.login =(req, res, next)=> {
    res.render('user/login',{title: 'Login Page', message: req.message});
}

exports.cart =(req, res, next)=> {
  let isCart = true;
  res.render('cart',{title: 'Cart',user: req.user, isCart:isCart});
}

exports.postSignup = async(req, res, next)=>{
  console.log(req.body);
  let errors = [];
  let {email, password, retype_password, name, phone, address}=req.body;
  let  infor = req.body;
  //console.log(infor.email);
  // Check valid Infor 
  if(password==''){
      errors.push('Password is invalid');
      console.log('Password is invalid');
  }
  if(password!=retype_password){
        errors.push('Password is not correct');
        console.log('Password is not correct');
  }
  if(password.length < 6){
      errors.push('Password is at least 6 characters');
      console.log('Password is at least 6 characters');
  }
  if(errors.length>0){
    res.render('user/signup',{title: 'Signup Page', errors, infor: infor});
    return ;
  }

  //check email exist & verified
  let user = await userServices.findOne({email: email});
  if(user!=null){
    if(user.isVerified==true){
      errors.push('Email has registered. Please use another email.')
      res.render('user/signup',{title: 'signup Page', errors, infor: infor});
    }else{
        //update user
        bcrypt.hash(password,saltRounds,async (err, hash)=>{
          if(err) throw err;
          let tempUser = {
            email: email,
            password: hash, 
            name: name, 
            phone: phone, 
            address: address, 
            isVerified: false, 
            passwordResetExpires: Date.now()
          };
          let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verifi Email',
            text: `${process.env.URL_WEB}/api/auth/verification/verify-account/${user._id}/${process.env.SCRETCODE}`
          };
          await userServices.updateOne({_id: user._id},{ $set: tempUser });
          //Send email
          smptTransport.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                res.send('Please check mail to verifi');
              }
          });
       });
  
    }
  }else{
    // save into database
    //hash password
     bcrypt.hash(password,saltRounds,async (err, hash)=>{
       if(err) throw err;
       let tempUser = {
        email: email,
        password: hash, 
        name: name, 
        phone: phone, 
        address: address, 
        isVerified: false, 
        passwordResetExpires: Date.now()
      };
       await userServices.insertOne(tempUser);
       user = await userServices.findOne(tempUser);
       let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Sending Email using Node.js',
        text: `http://127.0.0.1:5000/api/auth/verification/verify-account/${user._id}/${process.env.SCRETCODE}`
      };
      //Send email
       smptTransport.sendMail(mailOptions, function(error, info){
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

