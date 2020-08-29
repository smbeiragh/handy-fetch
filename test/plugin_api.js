import chai, { expect } from 'chai';
import spies from 'chai-spies';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import { createHandyFetch } from '../src';

chai.use(spies);

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

describe('fetch.use', () => {
  it('should setup a plugin', () => {
    const fetcher = createHandyFetch();

    const expectedBody = 'test response!';

    expect(fetcher.use, 'expect fetch.use be a function').to.be.a('function');

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [201, requestBody]);
        }, 10);
      });

    const onOptions = chai.spy((opt) => ({ ...opt, body: expectedBody }));

    const onReturn = chai.spy((response) => response);

    const getChain = chai.spy(() => null); // keep plugin chain untouched by returning null

    fetcher.use(({ fetch }) => {
      expect(fetch).to.be.a('function');

      return {
        name: 'test',
        onOptions,
        onReturn,
        getChain,
      };
    });

    expect(fetcher.test, 'expect fetch.test to be a function').to.be.a('function');

    return fetcher.test('http://www.test.com/resource', { method: 'post' })
      .then((response) => {
        const { body } = response;
        expect(onOptions).to.have.been.called();
        expect(onReturn).to.have.been.called();
        expect(getChain).to.have.been.called();
        expect(body).to.be.equal(expectedBody);
      });
  });

  it('should setup a plugin without chaining helper method', () => {
    const fetch = createHandyFetch();

    expect(fetch.use, 'expect fetch.use be a function').to.be.a('function');

    fetch.use(() => ({
      name: 'test',
      helper: false,
    }));

    expect(fetch.test, 'expect fetch.test to be a function').to.be.a('undefined');
    expect(fetch.json.test, 'expect fetch.test to be a function').to.be.a('undefined');
  });

  it('should throw on duplicate plugin', () => {
    const fetch = createHandyFetch();

    fetch.use(() => ({
      name: 'testDuplicate',
      onOptions: (opt) => opt,
    }));

    expect(() => fetch.use(() => ({
      name: 'testDuplicate',
      onOptions: (opt) => opt,
    }))).to.throw(Error);

    fetch.use(
      () => ({
        name: 'testDuplicate',
        onOptions: (opt) => opt,
      }),
      { replace: true, name: 'testDuplicate' },
    );
  });

  it('should throw on using reserved names', () => {
    const fetch = createHandyFetch();

    expect(() => fetch.use(() => ({
      name: 'use',
      onOptions: (opt) => opt,
    }))).to.throw(Error);
  });
});

describe('fetch.alias', () => {
  it('should setup an alias', () => {
    const fetch = createHandyFetch();
    const expectedBody = 'test response!';

    expect(fetch.alias).to.be.a('function');
    expect(fetch.use).to.be.a('function');

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [201, requestBody]);
        }, 10);
      });

    const onOptions = chai.spy((opt) => ({ ...opt, method: 'post', body: expectedBody }));

    fetch.use(() => ({
      name: 'test',
      onOptions,
    }));

    fetch.alias('test2', fetch.test);

    expect(fetch.test2).to.be.a('function');

    return fetch.test2('http://www.test.com/resource')
      .then((response) => {
        const { body } = response;
        expect(onOptions).to.have.been.called();
        expect(body).to.be.equal(expectedBody);
      });
  });

  it('should setup default alias', () => {
    const fetch = createHandyFetch();
    const expectedBody = 'test response!!!';

    expect(fetch.alias).to.be.a('function');
    expect(fetch.use).to.be.a('function');

    nock('http://www.test.com')
      .post('/resource')
      .reply((uri, requestBody, cb) => {
        setTimeout(() => {
          cb(null, [201, requestBody]);
        }, 10);
      });

    const onOptions = chai.spy((opt) => ({ ...opt, method: 'post', body: expectedBody }));

    fetch.use(() => ({
      name: 'test',
      onOptions,
    }));

    fetch.alias('default', fetch.base.test, true);

    return fetch('http://www.test.com/resource')
      .then((response) => {
        const { body } = response;
        expect(onOptions).to.have.been.called();
        expect(body).to.be.equal(expectedBody);
      });
  });

  it('should throw on duplicate alias', () => {
    const fetch = createHandyFetch();
    fetch.alias('testDuplicate', fetch);
    expect(() => fetch.alias('testDuplicate', fetch)).to.throw(Error);
  });

  it('should throw on using reserved names', () => {
    const fetch = createHandyFetch();
    expect(() => fetch.alias('alias', fetch)).to.throw(Error);
  });
});

describe('fetch.clone', () => {
  it('should clone the chain', () => {
    const fetch = createHandyFetch();

    expect(fetch.clone).to.be.a('function');

    expect(fetch.clone()).to.be.a('function');
    expect(fetch.clone(true)).to.be.a('object');
  });
});
