/*!
 * genem
 * Copyright(c) 2012 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

var os = require('os')
  , fs = require('fs')
  , inflection = require('inflection')

var eol = 'win32' == os.platform() ? '\r\n' : '\n';

/**
 * Creates package.json
 *
 * @param {String} auth
 * @return {Object}
 * @api private
 */

function package (auth) {
  var pkg =  {
    name: 'application name',
    version: '0.0.1',
    engines: {
      node: '0.6.18',
      npm: '1.1.9'
    },
    private: true,
    scripts: { start: './node_modules/.bin/nodemon server.js' },
    dependencies: {
      'express': 'latest',
      'mongoose': 'latest',
      'connect-mongo': 'latest',
      'async': 'latest',
      'jade': 'latest',
      'view-helpers': 'latest'
    },
    devDependencies: {
      'nodemon': 'latest',
      'mocha': 'latest',
      'should': 'latest'
    }
  }

  if (auth) {
    pkg.dependencies['passport'] = 'latest';
    pkg.dependencies['passport-' + auth] = 'latest';
  }

  return pkg;
}

/**
 * Creates Jade default layout app/views/layouts/default.jade
 *
 * @return {String}
 * @api private
 */

function layout () {
  return [
    'doctype 5',
    'html',
    '  include ../includes/head',
    '  body',
    '    .wrapper',
    '      include ../includes/header',
    '      .container',
    '        .main-content',
    '          .main-head',
    '            block main',
    '          block content',
    '      .push',
    '    include ../includes/footer',
    '    include ../includes/foot'
  ].join(eol);
}

/**
 * Creates config/config.js
 *
 * @param {String} appName
 * @param {String} auth
 * @return {String}
 * @api private
 */

function config (appName, auth) {
  var config = [
    'module.exports = {',
    '  development: {',
    '    root: require(\'path\').normalize(__dirname + \'/..\'),',
    '    db: \'mongodb://localhost/'+ appName +'Dev\',',
    '    app: {',
    '      name: \''+ appName + '\'',
    '    },'
  ];

  if (auth && auth !== 'local') {
    config = config.concat([
      '    '+ auth +': {',
      '      clientID: \'APP_ID\',',
      '      clientSecret: \'APP_SECRET\',',
      '      callbackURL: \'http://localhost:3000/auth/'+ auth +'/callback\',',
      '    }',
      '  },'
    ]);
  } else {
    config = config.concat([
      '  },'
    ]);
  }

  config = config.concat([
    '  test: {',
    '',
    '  },',
    '  production: {',
    '',
    '  }',
    '}'
  ]);

  return config.join(eol);
}

/**
 * Creates routing middleware for auth
 *
 * @return {String}
 * @api private
 */

function routeMiddleware () {
  return [
    '',
    '/**',
    ' * Module dependencies.',
    ' */',
    '',
    'exports.requiresLogin = function (req, res, next) {',
    '  if (req.user)',
    '    next()',
    '  else',
    '    return res.render(\'401\')',
    '}',
    ''
  ].join(eol);
}

/**
 * Creates config/routes.js
 *
 * @param {String} auth
 * @return {String}
 * @api private
 */

function routes (auth) {
  var routes = [
    '',
    '/**',
    ' * Module dependencies.',
    ' */',
    '',
    'var mongoose = require(\'mongoose\')'
  ];

  if (auth) {
    routes = routes.concat([
      '  , middlewares = require(\'./middlewares\')'
    ]);
  }

  routes = routes.concat([
    '',
    'module.exports = function (app, passport, auth) {',
    '',
    '  var home = require(\'../app/controllers/home\')',
    '  app.get(\'/\', home.index)',
    '',
    '}'
  ]).join(eol);

  return routes;
}

/**
 * Creates config/passport.js
 *
 * @param {Type} name
 * @return {Type}
 * @api public
 */

function passport (auth) {
  var passport = [
    '',
    'var mongoose = require(\'mongoose\')',
    '  , ' + inflection.capitalize(auth) + 'Strategy = require(\'passport-' + auth + '\').Strategy',
    '  , User = mongoose.model(\'User\')',
    '',
    'module.exports = function (passport, config) {',
    '  // require(\'./initializer\')',
    '',
    '  // serialize sessions',
    '  passport.serializeUser(function(user, done) {',
    '    done(null, user.id)',
    '  })',
    '',
    '  passport.deserializeUser(function(id, done) {',
    '    User.findOne({ _id: id }, function (err, user) {',
    '      done(err, user)',
    '    })',
    '  })',
  ];

  var local = [
    '',
    '  // use local strategy',
    '  passport.use(new LocalStrategy({',
    '      usernameField: \'email\',',
    '      passwordField: \'password\'',
    '    },',
    '    function(email, password, done) {',
    '      User.findOne({ email: email }, function (err, user) {',
    '        if (err) { return done(err) }',
    '        if (!user) {',
    '          return done(null, false, { message: \'Unknown user\' })',
    '        }',
    '        if (!user.authenticate(password)) {',
    '          return done(null, false, { message: \'Invalid password\' })',
    '        }',
    '        return done(null, user)',
    '      })',
    '    }',
    '  ))',
    '}'
  ];

  var consumerkey = 'consumerKey';
  var consumersec = 'consumerSecret';
  if (auth === 'facebook' || auth === 'github') {
    consumerkey = 'clientID';
    consumersec = 'clientSecret';
  }

  var authStrategy = [
    '',
    '  // use '+ auth +' strategy',
    '  passport.use(new '+ inflection.capitalize(auth) +'Strategy({',
    '      '+ consumerkey +': config.'+ auth +'.clientID,',
    '      '+ consumersec +': config.'+ auth +'.clientSecret,',
    '      callbackURL: config.'+ auth +'.callbackURL',
    '    },',
    '    function(token, tokenSecret, profile, done) {',
    '      User.findOne({ \''+ auth +'.id\': profile.id }, function (err, user) {',
    '        if (err) { return done(err) }',
    '        if (!user) {',
    '          user = new User({',
    '            name: profile.displayName,',
    '            username: profile.username,',
    '            provider: \''+ auth +'\',',
    '            '+ auth +': profile._json',
    '          })',
    '          user.save(function (err, user) {',
    '            if (err) console.log(err)',
    '            return done(err, user)',
    '          })',
    '        }',
    '        else {',
    '          return done(err, user)',
    '        }',
    '      })',
    '    }',
    '  ))',
    '}',
    ''
  ];

  if (auth === 'local') {
    passport = passport.concat(local);
  } else {
    passport = passport.concat(authStrategy);
  }

  passport = passport.join(eol);

  return passport;
}

/**
 * Creates public/css/app.css
 *
 * @param {Type} name
 * @return {String}
 * @api private
 */

function css () {
  return [
    'body {',
    '  padding: 50px;',
    '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;',
    '}',
    '',
    'a {',
    '  color: #00B7FF;',
    '}'
  ].join(eol);
}

/**
 * Creates server.js
 *
 * @param {String} auth
 * @return {String}
 * @api private
 */

function server (auth) {
  var server = [
    '',
    '/**',
    ' * Module dependencies',
    ' */',
    '',
    'var express = require(\'express\')'
  ];

  if (auth) {
    server = server.concat([
      '  , passport = require(\'passport\')'
    ]);
  } else {
    server = server.concat([
      '  , passport = undefined'
    ]);
  }

  server = server.concat([
    '  , env = process.env.NODE_ENV || \'development\'',
    '  , config = require(\'./config/config\')[env]',
    '  , mongoose = require(\'mongoose\')',
    '  , modelsPath = __dirname + \'/app/models\'',
    '',
    'mongoose.connect(config.db)',
    '',
    '// Bootstrap models',
    'require(\'fs\').readdirSync(modelsPath).forEach(function (file) {',
    '  require(modelsPath+\'/\'+file)',
    '})'
  ]);

  if (auth) {
    server = server.concat([
      '',
      '// Bootstrap passport config',
      'require(\'./config/passport\')(passport, config)'
    ]);
  }

  server = server.concat([
    '',
    'var app = express()',
    '',
    '// Bootstrap application settings',
    'require(\'./config/express\')(app, config, passport)',
    '',
    '// Bootstrap routes',
    'require(\'./config/routes\')(app, passport)',
    '',
    '// Start the app by listening on <port>',
    'var port = process.env.PORT || 3000',
    'app.listen(port)',
    'console.log(\'Express app started on port \'+port)',
    ''
  ]);

  return server.join(eol);
}

/**
 * Creates model (app/models/[modelName.js])
 *
 * @param {String} name
 * @param {Array} fields
 * @return {String}
 * @api private
 */

function model (name, fields) {
  name = inflection.capitalize(name)

  var model = [
    '',
    '/**',
    ' * Module dependencies',
    ' */',
    '',
    'var mongoose = require(\'mongoose\')',
    '  , Schema = mongoose.Schema',
    '',
    'var '+ name +'Schema = new Schema({'
  ];

  var last = '';
  var schema = fields.map(function (field, index) {
    last = index == (fields.length - 1) ? '' : ',';
    return '  '+ field.name +': \''+ field.type +'\''+ last;
  });

  model = model.concat(schema)

  model = model.concat([
    '})',
    '',
    'mongoose.model(\''+ name +'\', '+ name +'Schema)',
    ''
  ]);

  return model.join(eol);
}

/**
 * Creates controllers (app/controllers/[controllerName.js])
 *
 * @param {String}
 * @param {String} method
 * @param {String} model
 * @return {String}
 * @api private
 */

function controller (name, method, model) {
  var plural = name === 'home'
    ? 'home'
    : inflection.pluralize(name);
  var template = plural + '/' + method;
  name = name;

  var controller = [
    '',
    '/**',
    ' * Module dependencies',
    ' */'
  ];

  if (model) {
    controller = controller.concat([
      '',
      'var mongoose = require(\'mongoose\')',
      '  , '+ name +' = mongoose.model(\''+ name +'\')'
    ]);
  }

  controller = controller.concat([
    '',
    'exports.'+ method +' = function (req, res) {',
    '  res.render(\''+ template +'\', {title: \''+ method +'\'})',
    '}'
  ])

  return controller.join(eol);
}

/**
 * Creates a template in app/views/[viewName]/
 *
 * @param {String} title
 * @param {String} description
 * @param {Boolean} relative
 * @return {String}
 * @api private
 */

function template (title, description, relative) {
  var path = 'layouts/default';
  description = description || '';

  if (relative) path = relative + 'layouts/default';

  var template = [
    'extends '+ path,
    '',
    'block content'
  ];

  if (title) {
    template = template.concat([
      '  h1 '+ title
    ]);
  }

  template = template.concat([
    '  p '+ description,
    ''
  ]);

  return template.join(eol);
}

/**
 * Head template
 *
 * Goes in the `head` section of layout
 *
 * @return {String}
 * @api public
 */

function head () {
  var head = [
    'head',
    '  meta(charset="utf-8")',
    '  meta(http-equiv="X-UA-Compatible", content="IE=edge,chrome=1")',
    '  meta(name="viewport", content="width=device-width,initial-scale=1")',
    '',
    '  title= appName+\' - \'+title',
    '  meta(http-equiv="Content-type", content="text/html;charset=UTF-8")',
    '  meta(name="keywords", content="")',
    '  meta(name="description", content="")',
    '',
    '  link(href="/favicon.ico", rel="shortcut icon", type="image/x-icon")',
    '',
    '  link(rel="stylesheet", href="/css/app.css")'
  ];

  return head.join(eol);
}

/**
 * Header template
 *
 * @return {String}
 * @api public
 */

function header (app) {
  var header = [
    'header#header',
    '  h1.logo= appName'
  ];

  return header.join(eol);
}

/**
 * Intro template
 *
 * @return {String}
 * @api public
 */

function intro () {
  var intro = [
    'Things to do',
    '  ol',
    '    li Add some routes',
    '    li Add some models, views and controllers',
    '    li Refer to&nbsp;',
    '      a(href="https://github.com/madhums/nodejs-express-mongoose-demo") the demo app',
    '    li Change the content of&nbsp;',
    '      code app/views/home/index.jade'
  ];

  return intro.join(eol);
}

exports.model = model;
exports.controller = controller;
exports.template = template;
exports.passport = passport;
exports.server = server;
exports.routeMiddleware = routeMiddleware;
exports.routes = routes;
exports.express = fs.readFileSync(__dirname + '/templates/express.js')
exports.viewHelper = fs.readFileSync(__dirname + '/templates/view-helper.js')
exports.css = css;
exports.config = config;
exports.layout = layout;
exports.pkg = package;
exports.head = head;
exports.header = header;
exports.intro = intro;
