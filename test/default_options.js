import { expect } from 'chai';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import { createHandyFetch } from '../src';

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

const fetchWrapper = (url, options) => nodeFetch(
  url, { ...options, body: JSON.stringify(options) },
);

// TODO test default options
describe('Default Options', () => {
  it('should create fetch without default options', () => {
    const expected = {
      shouldParseBody: true,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer <token>',
      },
    };

    const fetch = createHandyFetch({
      fetch: fetchWrapper,
      defaultOptions: null,
    });

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [200, requestBody]);
        }, 10);
      });

    return fetch('http://www.test.com/resource', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer <token>',
      },
    }).then((response) => {
      expect(response.body, 'expect to set default options').to.be.deep.equal(expected);
    });
  });

  it('should set default options', () => {
    const expected = {
      shouldParseBody: true,
      credentials: 'same-origin',
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer <token>',
      },
    };

    const fetch = createHandyFetch({
      fetch: fetchWrapper,
      defaultOptions: {
        credentials: 'same-origin',
      },
    });

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [200, requestBody]);
        }, 10);
      });

    return fetch('http://www.test.com/resource', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer <token>',
      },
    }).then((response) => {
      expect(response.body, 'expect to set default options').to.be.deep.equal(expected);
    });
  });

  it('should set default headers', () => {
    const expected = {
      shouldParseBody: true,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer <token>',
      },
    };

    const fetch = createHandyFetch({
      fetch: fetchWrapper,
      defaultOptions: { },
    });

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [200, requestBody]);
        }, 10);
      });

    return fetch('http://www.test.com/resource', {
      shouldParseBody: true,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer <token>',
      },
    }).then((response) => {
      expect(response.body, 'expect to set default options').to.be.deep.equal(expected);
    });
  });

  it('should merge default headers with user headers', () => {
    const expected = {
      shouldParseBody: true,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer <token>',
        custom: 'another custom header',
      },
    };

    const fetch = createHandyFetch({
      fetch: fetchWrapper,
      defaultOptions: {
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer <token>',
          custom: 'a custom header',
        },
      },
    });

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [200, requestBody]);
        }, 10);
      });

    return fetch('http://www.test.com/resource', {
      method: 'post',
      headers: {
        custom: 'another custom header',
      },
    }).then((response) => {
      expect(response.body, 'expect to merge default headers').to.be.deep.equal(expected);
    });
  });

  it('should merge headers of type Header class', () => {
    const expected = {
      shouldParseBody: true,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer <token>',
        custom: 'another custom header',
      },
    };

    const fetch = createHandyFetch({
      fetch: fetchWrapper,
      defaultOptions: {
        headers: new Headers({
          'content-type': 'application/json',
          authorization: 'Bearer <token>',
          custom: 'a custom header',
        }),
      },
    });

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [200, requestBody]);
        }, 10);
      });

    return fetch('http://www.test.com/resource', {
      method: 'post',
      headers: {
        custom: 'another custom header',
      },
    }).then((response) => {
      expect(response.body, 'expect to merge default headers').to.be.deep.equal(expected);
    });
  });

  it('should merge headers with multiple values', () => {
    const expected = {
      shouldParseBody: true,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer <token>',
        custom: ['value1', 'value2', 'value3'],
        custom2: ['v3', 'v4'],
      },
    };

    const fetch = createHandyFetch({
      fetch: fetchWrapper,
      defaultOptions: {
        headers: new Headers({
          'content-type': 'application/json',
          authorization: 'Bearer <token>',
          custom: ['value1', 'value2', 'value3'],
          custom2: 'another custom header',
        }),
      },
    });

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [200, requestBody]);
        }, 10);
      });

    return fetch('http://www.test.com/resource', {
      method: 'post',
      headers: {
        custom2: ['v3', 'v4'],
      },
    }).then((response) => {
      expect(response.body, 'expect to merge headers with multiple values').to.be.deep.equal(expected);
    });
  });
});
