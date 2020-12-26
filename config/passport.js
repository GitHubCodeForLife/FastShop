const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { use } = require('passport');
const { ObjectId} = require('mongodb');
//Load User model 
const User = require('../model/userServices');

module.exports = (passport)=>{

    passport.use(
        new LocalStrategy({usernameField: 'email'},async (email, password, done)=>{
            //Find user
            const user = await User.findOne({email: email});
            if(!user){
                console.log('Email chưa được đăng ký vui lòng đăng ký trước khi đăng nhập.');
                return done(null, false, {message: 'Email chưa được đăng ký vui lòng đăng ký trước khi đăng nhập'});   
            }
            if(user.isVerified==false){
                console.log('Vui lòng xác thực email trước khi đăng nhập.');
                return done(null, false, {message: 'Vui lòng xác thực email trước khi đăng nhập.'});   
            }
            //Macth password
            bcrypt.compare(password, user.password,(err, result)=>{
                if(err) throw err;
                if(result){
                    return done(null, user);
                }else{
                    console.log('Password is incorrect.');
                    return done(null, false, {message: 'Mật khẩu đã nhập không chính xác.'});
                }
            });
        })
    );
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });
    passport.deserializeUser(async(id, done)=>{
        console.log('ID user: '+id);
        const user = await User.findOne({_id: new ObjectId(id)});
        return done(null, user);
    });
}