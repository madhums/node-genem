
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , middlewares = require('./middlewares')

/**
   * Format for routes
   *
   * app.METHOD('/route/path', [middlewares], controller.method)
   */

module.exports = function (app, passport, auth) {

  var home = require('../app/controllers/home')
  app.get('/', home.index)

}
