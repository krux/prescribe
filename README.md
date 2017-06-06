# Overview

[![Version](https://img.shields.io/npm/v/prescribe.svg)](http://npmjs.com/package/prescribe)
[![License](https://img.shields.io/npm/l/prescribe.svg)](http://npmjs.com/package/prescribe)
[![Build Status](https://travis-ci.org/krux/prescribe.svg?branch=master)](https://travis-ci.org/krux/prescribe)
[![Code Climate](https://img.shields.io/codeclimate/github/krux/prescribe.svg)](https://codeclimate.com/github/krux/prescribe)
[![Coverage](https://img.shields.io/coveralls/krux/prescribe.svg)](https://coveralls.io/github/krux/prescribe)
[![Dependencies](https://img.shields.io/david/dev/krux/prescribe.svg)](./package.json)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Gitter](https://badges.gitter.im/krux/prescribe.svg)](https://gitter.im/krux/prescribe)

Tiny, forgiving HTML parser in JavaScript.  This module started life as code from John Resig and
has evolved and morphed over the years of hardening and use in Krux's [postscribe](https://github.com/krux/postscribe)
library.  This library doesn't aim for the greatest level of compliance, but rather to be as forgiving
of real-life code encountered in scenarios like ad serving.

## Installation

### Browser

If you just want to use the script without installing anything:

```html
<script src="dist/prescribe.min.js"></script>
```

### NPM

You can include `prescribe` using *npm*:

```console
npm install --save prescribe
```

This script runs in browsers, so this assumes you're using a module bundler like [webpack](https://webpack.github.io/),
[Browserify](http://browserify.org/), [JSPM](http://jspm.io/) or [Rollup](http://rollupjs.org/) to consume CommonJS modules.

## Accessing

### ES6/ES2015

```javascript
import HtmlParser from 'prescribe';
```

### AMD

```javascript
define(['prescribe'], function(HtmlParser) {

});
```

### CommonJS

```javascript
var HtmlParser = require('prescribe');
```

# Browser Compatibility

This module is meant to parse any HTML that you can throw at it and do something meaningful, and we've taken care to make sur
that it works on every browser we can get our hands on. We expect it to work on every browser built after 2009. There are over
30 [unit tests](./test) that run on every commit. Prescribe is thoroughly tested and known to work well in the following browsers:

* Firefox 4+
* Chrome 10+
* Safari 5.0+
* Opera 10.0+
* Internet Explorer 8+
* iPhone/iPad and other WebKit-based browsers

Note that we do not provide any support for Internet Explorer versions earlier than IE8.

# Help/Bugs/Requests

We ♥ bug reports.

Have a problem? Need help? Would you like additional functionality added? We use GitHub's ticket system for keeping track of these requests.

Please check out the [existing issues](https://github.com/krux/prescribe/issues), and if you don't see that your problem is already being
worked on, please [file a new issue](https://github.com/krux/prescribe/issues/new). The more information the better to describe your problem.

# Contributing

We ♥ [forks and pull requests](https://help.github.com/articles/using-pull-requests).

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

## Environment

The project requires nodejs (>=5.6) and npm (>=3.6.0) for development. It has no runtime dependencies.

## Developing

Check the code out and install the development dependencies using:

```console
npm install
```

### Building

To build the code, run

```console
npm run build
```

### Linting

We use ESLint and JSCS to do static analysis of the JavaScript and keep things smelling good.  To run both, use:

```console
npm run lint
```

### Testing

Using [travis-ci](https://travis-ci.org), the [Mocha](http://mochajs.org) unit tests are run on every commit using PhantomJS to run the tests
with a real browser.

To test the code locally, you can use:

```console
npm test
```

To run tests in Test-Driven-Development mode, where the test will be run after every change, use:

```console
npm run tdd
```

To run the cross-browser tests, use:

```console
npm run test:cross-browser
```

## Issue Guidelines

Please either add a failing [unit test](./test/unit) or include a [jsfiddle](http://jsfiddle.net) that distills and reproduces the issue.

# License

We aim for you to use this inside your application, so we picked the least restrictive license we could find: the MIT license.

See [LICENSE](LICENSE).

