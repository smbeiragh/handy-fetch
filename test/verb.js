import { expect } from 'chai';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import { fetch } from './../src';

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

describe('fetch.verb', () => {
  it('Should support get,post,put,patch,delete,head methods', () => {
    expect(fetch.get).to.be.a('function');
    expect(fetch.post).to.be.a('function');
    expect(fetch.put).to.be.a('function');
    expect(fetch.patch).to.be.a('function');
    expect(fetch.delete).to.be.a('function');
    expect(fetch.head).to.be.a('function');

    const expectedBody = 'test response!';

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [200, requestBody]);
        }, 10);
      });

    return fetch.post('http://www.test.com/resource', { body: expectedBody })
      .then((response) => {
        expect(response.body).to.equal(expectedBody);
      });
  });
});
