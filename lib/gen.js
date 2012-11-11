/*!
 * gen
 * Copyright(c) 2012 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

var os = require('os')
  , eol = 'win32' == os.platform() ? '\r\n' : '\n'

exports.pkg = {
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

exports.jadeLayout = [
].join(eol)

exports.config = [
].join(eol)

exports.express = [
].join(eol)

exports.routes = [
].join(eol)

exports.server = [
].join(eol)

exports.model = [
].join(eol)

exports.controller = [
].join(eol)

exports.view = [
].join(eol)
