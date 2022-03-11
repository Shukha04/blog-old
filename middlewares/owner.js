module.exports = function (req, res, next) {
  if (!req.session.isOwner) {
    return res.status(404)
  }

  next()
}