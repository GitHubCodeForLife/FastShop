const userServices = require('../model/userServices');
const Handelbars = require('handlebars');
const bcrypt = require('bcrypt');
exports.index = (req, res, next)=>{
    res.render('index', { title: 'FastShop' });
}

exports.register =(req, res, next)=> {
    res.render('user/register',{title: 'Register',error:'No errors'});
}

exports.login =(req, res, next)=> {
    res.render('user/login',{title: 'Login'});
}

exports.postRegister = async(req, res, next)=>{
  console.log(req.body);
  //Check Email exits
  const checkEmail = await userServices.checkEmail(req.body.email);
  //Hash password -> bycript 
 
  if(checkEmail==true){
    res.render('user/register',{title: 'Register Again', errors: 'Email has registered.'});
  }else{
    //save Database
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await userServices.register(req.body.firstName, req.body.lastName, req.body.email, req.body.mobileNo,hashedPassword);
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
 }
}





