
/**
 * Module dependencies.
 */

exports.requiresLogin = function (req, res, next) {
  if (req.user)
    next()
  else
    return res.render('401')
}
