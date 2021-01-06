module.exports = {
  checkAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    if(req.url == '/check-out'){
      console.log('check out');
      res.redirect('/login?redirect=check-out');
      return;
    }
  },
  checkNotAuthenticated: function (req, res, next) {

    if (req.isAuthenticated()) {
      return res.redirect('/users/dashboard')
    }
    next()
  }
};