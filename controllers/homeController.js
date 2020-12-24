const userServices = require('../model/userServices');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.index = (req, res, next)=>{
  console.log('User: ', req.user);
    res.render('index', { title: 'FastShop' , user: req.user});
}

exports.signup =(req, res, next)=> {
    res.render('user/signup',{title: 'Signup Page'});
}

exports.login =(req, res, next)=> {
    res.render('user/login',{title: 'Login Page', message: req.message});
}

exports.postSignup = async(req, res, next)=>{
  console.log(req.body);
  //Check errors valid
  let errors = [];
  let {email, password, retype_password, name, phone, address}=req.body;
  if(password==''){
      errors.push('Password is invalid');
      console.log('Password is invalid');
  }
  if(password!=retype_password){
        errors.push('Password is not correct');
        console.log('Password is not correct');
  }
  if(password.length < 6){
      errors.push('Password is at least 6 characters.');
      console.log('Password is at least 6 characters');
  }
  if(errors.length>0){
    res.render('user/signup',{title: 'Signup Page', errors});
  }else{
      //check email exist
      let user = await userServices.findOne({email: email});
      if(user!=null){
        errors.push('Email has signuped. Please use another email.')
        res.render('user/signup',{title: 'signup Page', errors});
      }else{
        // save into database
        //hash password
         bcrypt.hash(password,saltRounds,async (err, hash)=>{
           if(err) throw err;
           await userServices.insertOne({email: email, password: hash, name: name, phone: phone, address: address});
          console.log('Inserted One user into database');
        });
        res.redirect('/login');
      }
  }
}
