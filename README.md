## node-gen
A MVC generator for node.js (uses express, mongoose, jade and passport.js). Based on [nodejs-express-demo](http://github.com/madhums/nodejs-express-mongoose-demo)

## Installation

```sh
$ npm install gen -g
```

## Usage

```
Usage: gen [command]

commands:

  init [app name][options]      creates the mvc boilerplate of name [app name]
  model [name]                  creates a model file of name [name]
  controller [name] [methods]   creates a controller file of name [name] with
                                methods [methods] and adds it to routes
  views [resource] [name(s)]    creates view files [names] under a folder
                                of name [resource]

options:
  --no-auth                     does not create any auth configs
```

## Directory structure

```
-app/
  |__controllers/
  |__models/
  |__views/
-config/
  |__middlewares/
  |__routes.js
  |__express.js
  |__config.js
  |__passport.js (auth config)
-test/
-public/
-server.js
```

## To do
everything

## License
(The MIT License)

Copyright (c) 2012 Madhusudhan Srinivasa < [madhums8@gmail.com](mailto:madhums8@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
