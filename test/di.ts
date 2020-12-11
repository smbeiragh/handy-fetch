import chai, { expect } from 'chai';
import spies from 'chai-spies';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import { createHandyFetch, fetch } from '../src/index';

chai.use(spies);

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

describe('Dependency Injection Options', () => {
  describe('should accept fetch function as dependency via createHandyFetch options', () => {
    const fetchSpy = chai.spy(nodeFetch);

    it('should use injected fetch function', () => {
      const fetcher = createHandyFetch({ fetch: fetchSpy });

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, 'domain matched');

      return fetcher('http://www.test.com/resource')
        .then(() => {
          expect(fetchSpy, 'expect injected fetch to have been called').to.have.been.called();
        });
    });
  });

  describe('should accept fetch function as dependency via fetch property', () => {
    const fetchSpy = chai.spy(nodeFetch);

    it('should use injected fetch function', () => {
      fetch.fetch = fetchSpy;

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, 'domain matched');

      return fetch('http://www.test.com/resource')
        .then(() => {
          expect(fetchSpy, 'expect injected fetch to have been called').to.have.been.called();
        });
    });
  });
});
