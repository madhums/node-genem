## node-gen
A MVC generator for node.js (uses express, mongoose, jade and passport.js). Based on [nodejs-express-demo](http://github.com/madhums/nodejs-express-mongoose-demo)

## Installation

```sh
$ npm install gen -g
```

## Usage

```
Usage: gen [options]

  Options:

    -h, --help                            output usage information
    -V, --version                         output the version number
    i, init <app>                         initialize app with name <app>
    m, model <model> <fields>             creates a mongoose model of name <model> with fields <fields>
    c, controller <controller> <methods>  creates a controller of name <controller> with methods <methods>
    v, view <view> <views>                creates a view of name <name> with views <views>
    -a, --auth <auth>                     adds passport.js authentication (twitter|facebook|github|google)

  Examples:

    $ gen --help
    $ gen init my_app
    $ gen model user
    $ gen model user name:string age:number location:object
    $ gen controller users
    $ gen controller users create index show
    $ gen view users
    $ gen view users new edit show
    $ gen --auth
    $ gen --auth twitter facebook
```

## Directory structure

```
-app/
  |__controllers/
  |__models/
  |__views/
-config/
  |__routes.js
  |__express.js
  |__config.js
  |__passport.js (auth config)
-test/
-public/
  |__css/
  |__js/
  |__img/
-server.js
-package.json
-README.md
```

## To do
everything

## License
(The MIT License)

Copyright (c) 2012 Madhusudhan Srinivasa < [madhums8@gmail.com](mailto:madhums8@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
