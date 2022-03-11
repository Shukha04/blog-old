module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuth
  res.locals.isAdmin = req.session.isAdmin
  res.locals.isOwner = req.session.isOwner
  res.locals.csrf = req.csrfToken()
  next()
}