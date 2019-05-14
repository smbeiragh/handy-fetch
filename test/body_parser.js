import { expect } from 'chai';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import { fetch, isHttpResponse } from '../src';

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

describe('body parser plugin', () => {
  describe('Should parse Response based on Content-Type header', () => {
    it('Should handle application/json', () => {
      const expectedBody = { prop: 'value' };

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'application/json' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body).to.deep.equal(expectedBody);
        });
    });

    it('Should handle application/ld+json', () => {
      const expectedBody = { prop: 'value' };

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'application/ld+json' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body).to.deep.equal(expectedBody);
        });
    });

    it('Should handle text/*', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'text/html' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body).to.equal(expectedBody);
        });
    });

    it('Should handle image/*', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'image/jpeg' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object Blob]');
        });
    });

    it('Should handle audio/*', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'audio/mpeg' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });

    it('Should handle video/*', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'video/mp4' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });

    it('Should handle video/*', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'video/mp4' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });

    it('Should handle application/octet-stream', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'application/octet-stream' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });

    it('Should handle application/zip', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'application/zip' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });

    it('Should handle application/ogg', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'application/ogg' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });

    it('Should handle application/pdf', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, { 'content-type': 'application/pdf' });

      return fetch('http://www.test.com/resource')
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });
  });

  describe('Should be able to deffer parsing Response.body', () => {
    it('Shouldn\'t parse Response.body', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', { shouldParseBody: false })
        .then((response) => {
          expect(response.body).to.equal(null);
          expect(response.bodyUsed).to.equal(false);
        });
    });

    it('Shouldn\'t parse Response.body', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', { shouldParseBody: () => false })
        .then((response) => {
          expect(response.body).to.equal(null);
          expect(response.bodyUsed).to.equal(false);
        });
    });

    it('Should parse Response.body', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', {
        shouldParseBody: (response, options) => {
          expect(isHttpResponse(response), 'expect response be instance of HttpResponse').to.be.equal(true);
          expect(options).to.be.a('object');
          return true;
        },
      })
        .then((response) => {
          expect(response.body).to.equal(expectedBody);
        });
    });

    it('Should parse Response.body as json', () => {
      const expectedBody = { property: 'value' };

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', { shouldParseBody: false })
        .then((response) => {
          expect(response.json).to.be.a('function');
          return response.json();
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(expectedBody);
        });
    });

    it('Should parse Response.body as text', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', { shouldParseBody: false })
        .then((response) => {
          expect(response.text).to.be.a('function');
          return response.text();
        })
        .then((response) => {
          expect(response.body).to.be.equal(expectedBody);
        });
    });

    it('Should parse Response.body as Blob', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', { shouldParseBody: false })
        .then((response) => {
          expect(response.blob).to.be.a('function');
          return response.blob();
        })
        .then((response) => {
          expect(response.body.toString()).to.be.equal('[object Blob]');
        });
    });

    it('Should parse Response.body as ArrayBuffer', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', { shouldParseBody: false })
        .then((response) => {
          expect(response.arrayBuffer).to.be.a('function');
          return response.arrayBuffer();
        })
        .then((response) => {
          expect(response.body.toString()).to.be.equal('[object ArrayBuffer]');
        });
    });

    it('Should parse Response.body as Buffer', () => {
      const expectedBody = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody);

      return fetch('http://www.test.com/resource', { shouldParseBody: false })
        .then((response) => {
          expect(response.buffer).to.be.a('function');
          return response.buffer();
        })
        .then((response) => {
          expect(response.body).to.be.an.instanceof(Buffer);
        });
    });
  });

  describe('Should parse Response based on "as" option', () => {
    it('should parse response as json via (as) option', () => {
      const expected = { propertyA: 'some value' };

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, JSON.stringify(expected));

      return fetch('http://www.test.com/resource', { as: 'json' })
        .then((response) => {
          expect(response.body, `expect response.body to be ${JSON.stringify(expected)}`).to.deep.equal(expected);
        });
    });

    it('should parse response as text via (as) option', () => {
      const expected = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expected);

      return fetch('http://www.test.com/resource', { as: 'text' })
        .then((response) => {
          expect(response.body).to.equal(expected);
        });
    });

    it('should parse response as Blob via (as) option', () => {
      const expected = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expected);

      return fetch('http://www.test.com/resource', { as: 'blob' })
        .then((response) => {
          expect(response.body.toString()).to.equal('[object Blob]');
        });
    });

    it('should parse response as ArrayBuffer via (as) option', () => {
      const expected = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expected);

      return fetch('http://www.test.com/resource', { as: 'arrayBuffer' })
        .then((response) => {
          expect(response.body.toString()).to.equal('[object ArrayBuffer]');
        });
    });

    it('should parse response as Buffer via (as) option', () => {
      const expected = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expected);

      return fetch('http://www.test.com/resource', { as: 'buffer' })
        .then((response) => {
          expect(response.body).to.be.an.instanceof(Buffer);
        });
    });

    it('should parse response as text when as options is wrong', () => {
      const expected = 'test response';

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expected);

      return fetch('http://www.test.com/resource', { as: 'wrong-as' })
        .then((response) => {
          expect(response.body).to.equal(expected);
        });
    });
  });
});
