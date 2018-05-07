import { expect } from 'chai';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import { createHandyFetch } from './../src';

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

describe('JSON Helper', () => {
  describe('fetch.json', () => {
    it('should set content-type: application/json on request', () => {
      const expectedHeader = 'application/json';
      const expectedBody = { propertyA: 'some value' };

      const nockReply = (uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [201, JSON.stringify(requestBody)]);
        }, 10);
      };

      const fetchWrapper = (url, options) => nodeFetch(url, { ...options, ...(('method' in options) ? { body: JSON.stringify(options) } : {}) });

      const fetch = createHandyFetch({ fetch: fetchWrapper });

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, JSON.stringify(expectedBody));

      nock('http://www.test.com')
        .post('/resource')
        .reply(nockReply);

      nock('http://www.test.com')
        .put('/resource')
        .reply(nockReply);

      nock('http://www.test.com')
        .delete('/resource')
        .reply(nockReply);

      return Promise.all([
        fetch.json.asJson('http://www.test.com/resource')
          .then((response) => {
            expect(response.body).to.deep.equal(expectedBody);
          }),
        fetch.json.asJson('http://www.test.com/resource', { method: 'POST', body: expectedBody })
          .then((response) => {
            const { body } = response;
            expect(JSON.parse(body.body)).to.deep.equal(expectedBody);
            expect(body.headers['Content-Type'], 'expect request.headers[\'Content-Type\'] to be \'application/json\'')
              .to.equal(expectedHeader);
          }),
        fetch.json.asJson('http://www.test.com/resource', { method: 'PUT', body: expectedBody })
          .then((response) => {
            const { body } = response;
            expect(JSON.parse(body.body)).to.deep.equal(expectedBody);
            expect(body.headers['Content-Type'], 'expect request.headers[\'Content-Type\'] to be \'application/json\'')
              .to.equal(expectedHeader);
          }),
        fetch.json.asJson('http://www.test.com/resource', { method: 'DELETE', body: expectedBody })
          .then((response) => {
            const { body } = response;
            expect(JSON.parse(body.body)).to.deep.equal(expectedBody);
            expect(body.headers['Content-Type'], 'expect request.headers[\'Content-Type\'] to be \'application/json\'')
              .to.equal(expectedHeader);
          }),
      ]);
    });
  });
});
