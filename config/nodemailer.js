exports.createTransport= (nodemailer)=>{
    return nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL_USER ,
              pass: process.env.EMAIL_PASSWORK
          }
      });
  }
  