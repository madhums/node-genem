/*!
 * gen
 * Copyright(c) 2012 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

var os = require('os')
  , eol = 'win32' == os.platform() ? '\r\n' : '\n'
  , fs = require('fs');

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.pkg = function (auth) {
  var pkg =  {
      name: 'application name'
    , version: '0.0.1'
    , engines: {
          node: '0.6.18'
        , npm: '1.1.9'
      }
    , private: true
    , scripts: { start: './node_modules/.bin/nodemon server.js' }
    , dependencies: {
          'express': 'latest'
        , 'mongoose': 'latest'
        , 'connect-mongodb': 'latest'
        , 'async': 'latest'
        , 'jade': 'latest'
      }
    , devDependencies: {
          'nodemon': 'latest'
        , 'mocha': 'latest'
        , 'should': 'latest'
      }
    }

  if (auth) {
    pkg.dependencies['passport'] = 'latest';
    pkg.dependencies['passport-' + auth] = 'latest';
  }

  return pkg;
}

exports.jadeLayout = [
].join(eol)

exports.config = fs.readFileSync(__dirname + '/templates/config.js')

exports.express = fs.readFileSync(__dirname + '/templates/express.js')

exports.routes = fs.readFileSync(__dirname + '/templates/routes.js')

exports.middlewares = fs.readFileSync(__dirname + '/templates/middlewares.js')

exports.server = fs.readFileSync(__dirname + '/templates/server.js')

exports.viewHelper = fs.readFileSync(__dirname + '/templates/view-helper.js')

exports.passport = function (auth) {
  var passport = [
        ''
      , 'var mongoose = require(\'mongoose\')'
      , '  , ' + capitalize(auth) + 'Strategy = require(\'passport-' + auth + '\').Strategy'
      , '  , User = mongoose.model(\'User\')'
      , ''
      , 'module.exports = function (passport, config) {'
      , '  // require(\'./initializer\')'
      , ''
      , '  // serialize sessions'
      , '  passport.serializeUser(function(user, done) {'
      , '    done(null, user.id)'
      , '  })'
      , ''
      , '  passport.deserializeUser(function(id, done) {'
      , '    User.findOne({ _id: id }, function (err, user) {'
      , '      done(err, user)'
      , '    })'
      , '  })'];


      var local = [
        ''
      , '  // use local strategy'
      , '  passport.use(new LocalStrategy({'
      , '      usernameField: \'email\','
      , '      passwordField: \'password\''
      , '    },'
      , '    function(email, password, done) {'
      , '      User.findOne({ email: email }, function (err, user) {'
      , '        if (err) { return done(err) }'
      , '        if (!user) {'
      , '          return done(null, false, { message: \'Unknown user\' })'
      , '        }'
      , '        if (!user.authenticate(password)) {'
      , '          return done(null, false, { message: \'Invalid password\' })'
      , '        }'
      , '        return done(null, user)'
      , '      })'
      , '    }'
      , '  ))'];

      var authStrategy = [
        ''
      , '  // use twitter strategy'
      , '  passport.use(new '+ capitalize(auth) +'Strategy({'
      , '        consumerKey: config.'+ auth +'.clientID'
      , '      , consumerSecret: config.'+ auth +'.clientSecret'
      , '      , callbackURL: config.'+ auth +'.callbackURL'
      , '    },'
      , '    function(token, tokenSecret, profile, done) {'
      , '      User.findOne({ \''+ auth +'.id\': profile.id }, function (err, user) {'
      , '        if (err) { return done(err) }'
      , '        if (!user) {'
      , '          user = new User({'
      , '              name: profile.displayName'
      , '            , username: profile.username'
      , '            , provider: \''+ auth +'\''
      , '            , '+ auth +': profile._json'
      , '          })'
      , '          user.save(function (err, user) {'
      , '            if (err) console.log(err)'
      , '            return done(err, user)'
      , '          })'
      , '        }'
      , '        else {'
      , '          return done(err, user)'
      , '        }'
      , '      })'
      , '    }'
      , '  ))'
      , '})'
      , ''];

  if (auth === 'local') {
    passport = passport.concat(local);
  } else {
    passport = passport.concat(authStrategy);
  }

  passport = passport.join(eol);

  return passport;
}
