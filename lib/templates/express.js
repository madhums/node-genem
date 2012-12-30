
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , helpers = require('../app/helpers/view')

module.exports = function (app, config, passport) {
  app.set('showStackError', true)
  app.use(express.static(config.root + '/public'))
  app.use(express.logger('dev'))
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')

  app.configure(function () {
    // dynamic helpers
    app.use(function (req, res, next) {
      res.locals.appName = '{app}'
      res.locals.title = '{app}'
      res.locals.req = req
      res.locals.formatDate = helpers.formatDate
      res.locals.stripScript = helpers.stripScript
      res.locals.createPagination = helpers.pagination
      next()
    })

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

    // cookieParser should be above session
    app.use(express.cookieParser())
    app.use(express.session({
      secret: '{app}',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    if (passport) {
      app.use(passport.initialize())
      app.use(passport.session())
    }

    // routes should be at the last
    app.use(app.router)

    // use express favicon
    app.use(express.favicon())

    // custom error handler
    app.use(function (err, req, res, next) {
      if (~err.message.indexOf('not found')) return next()
      console.error(err.stack)
      res.status(500).render('500')
    })

    app.use(function (req, res, next) {
      res.status(404).render('404', { url: req.originalUrl })
    })

  })
}
