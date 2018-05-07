# handy-fetch
[![Build Status](https://travis-ci.org/smbeiragh/handy-fetch.svg?branch=master)](https://travis-ci.org/smbeiragh/handy-fetch)
[![codecov](https://codecov.io/gh/smbeiragh/handy-fetch/branch/master/graph/badge.svg)](https://codecov.io/gh/smbeiragh/handy-fetch)

[![NPM](https://nodei.co/npm/handy-fetch.png)](https://nodei.co/npm/handy-fetch/)

Make fetch api handy!

A minimal fetch like fetch api wrapper that makes fetch api more convenient to use.

1. default options
2. automatic body parsing
3. handy utility methods
4. error handling utilities
5. plugable!
5. supports node.js and browser

## Environment
handy-fetch will function in every environment that supports Map, Symbol, Promise and fetch APIs
 in unsupported environments you can use appropriate polyfill(s).

## Installation

Using yarn: 

```
yarn add handy-fetch
``` 
Using npm:

```
npm install handy-fetch
```

## Usage

### Importing
```
import { fetch, createHandyFetch } from 'handy-fetch';

// OR

const { fetch, createHandyFetch} = require('handy-fetch');

// OR! feel free to add script tag!! and use window.handyFetch!
```

### Using Default instance

Using default handy-fetch instance just like normal fetch API
```
fetch('http:/google.com')
```

### Setting Default Options

Create a custom handy-fetch with default options
```
const fetch = createHandyFetch({defaultOptions: {
    headers: { 'Content-Type': 'application/json' }
}});

fetch('http://some-json.api', {
  body: JSON.strigify({some:'date'}},
  method: 'POST'
});

```

### Setting fetch Dependency
Using createHandyFetch factory
```
const fetch = createHandyFetch({
    fetch: nodeFetch
});

fetch('http://some-json.api')
```

Using fetch property. it is especially useful when using default handy-fetch instance.
```
fetch.fetch = nodeFetch

fetch('http://some-json.api')
```

### Processing response

handy-fetch parses response by default. it does it base on response content-type header.
 So you haven't to call `response.json().then()` and so on.

```
fetch('http://some-json.api').then((response) => {
  assert(typeof response.body === 'object');
});
```

### Helper Methods
Helper methods are a group of chain-able methods that help us to
 configure options parameter of fetch api or pre-process the final promise object for us.

#### JSON Helper
Post JSON as easy as this. handy-fetch will serialize body and adds content-type for you.
```
fetch.json('http://some-json.api', {
  body: { some: 'data' },
  method: 'POST'
});
```

#### asJSON Helper
Force parsing response as JSON. asJson also adds `Accept: 'application/json'` in request header
```
fetch.asJson('http://some-json.api', {
  body: { some: 'data' },
  method: 'POST'
});
```

#### Verbs Helpers
Helper methods for http verb including get, post, put, path, delete & head
```
fetch.post('http://some-json.api', {
  body: formData
});
```

#### Chaining helper methods
You can call as many as helpers you want using chaining pattern.
Post JSON as easy as this and force parsing the response asJson
```
fetch.post.json.asJson('http://some-json.api', {
  body: { some: 'data' },
  method: 'POST'
});
```
 
### Custom Options

handy-fetch has few none standard options.

#### as option
Sometimes we need force handy-fetch to parse response as something other than response content-type.

Accept following values:

1. json
2. text
3. blob
4. arrayBuffer
5. buffer

Default: based on Content-Type header and then defaults to text

**note:** buffer is node-fetch specific

```
fetch.json('http://some-json.api', {
  body: { some: 'data' },
  method: 'POST',
  as: 'json'
}).then((response) => {
  assert(typeof response.body === 'object');
}); 
```

#### shouldParseBody option
Controls if response should be parsed automatically or not

Accepts: boolean(true, false) or function

default: true

```
fetch('http://some-json.api', {
    shouldParseBody: false
}).then((response) => {
    assert(response.body === null);
    return response.josn(); // consuming body later
}).then((response) => {
    // body is parsed now!
    assert(typeof response.body === 'object');
});
```

Use a function when you want to determine if parse body or not based on request options and response
```
fetch('http://some-json.api', {
    shouldParseBody: (response, options) =>
        response.status !== 204
})
```

### Alias method
Defines an alias for a set of chained methods

.e.g
```
fetch.alias('rest', fetch.json.asJson)
```

Then we have a rest helper method that functions as same as fetch.json.asJson.
```
fetch.rest('http://some-json.api')
    .then((response) => {
        // lets have fun :D
        assert(typeof response.body === 'object');
    });
```

#### Default Alias
Default alias is an alias that will be called on every request and
applies a predefined group of helper methods on every request.

The default set of helper methods is equal to `base` alias

It defined as following:
```
fetcher.alias('default', fetcher.base, true);
```

The last parameter tells redefine it if it's exist.

You can redefine default alis to change default behavior.

This will call credentials helper on all request.

```
fetcher.alias('default', fetcher.base.credentials, true);
```

**note:**
keep in mind to use `base` otherwise you miss core plugins.

#### Base Alias
Base alias is an alias to a group of helper methods. It includes
most of handy-fetch functionality.

It defined as following:
```
fetcher.alias('base', fetcher.options.response.bodyParser.httpErrors, true);
```

### Error handling
There are few helper functions on `catchers` named export.
check them on `test` directory
```
fetch('http://some-json.api')
    .catch(catchers.notFound((err) => {
        console.log('her this is a 404!');
        assert(err.response.body === 'string');
    })
```

### Plugin API
handy-fetch is Plugable!
Check plugin api on `test` directory and base plugins on `src/plugins`

For example this is asJson plugin

```
fetch.use(() => ({
    // the helper method name
    name: 'asJson',
    // filter fetch options,
    // returning an array means merge arrray items from right to left.
    onOptions: options => ([options, { shouldParseBody: false, headers: { Accept: 'application/json' } }]),
    // filter final promise allways return promise
    onReturn: promise => promise.then(response => response.json()),
}))
```

### Response Class
Response object are similar to fetch api response. for details check source code at `src/response` and tests.

#### Response.requestOptions
contains the fetch api options that passed to.

### BadRequestError & InternalServerError
Check source code! Or complete this!

#### Error.response
Both classes have a response property that contains response object.

## Contributing
1. Fork repository
2. Commit your code on feature/branch or bugfix/branch
3. Write tests for new feature or bugs as needed
3. All codes must pass eslint guide-lines and test coverage

## TODO
1. Improving README.md
2. Adding helper methods for submitting forms and files

## License
MIT License

Copyright (c) 2018 Sajjad Mahdi Beiraghdar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.