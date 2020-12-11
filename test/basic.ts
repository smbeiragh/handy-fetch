import chai, { expect } from 'chai';
import spies from 'chai-spies';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import {
  fetch, isBadRequestError, isInternalServerError, isHttpResponse, createHandyFetch, catchers,
} from '../src/index';

chai.use(spies);

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

describe('Basic Tests', () => {
  describe('createHandyFetch', () => {
    it('should be a function', () => {
      expect(createHandyFetch, 'expect createHandyFetch be a function').to.be.a('function');
    });
  });

  describe('fetch', () => {
    it('should be a function', () => {
      expect(fetch, 'expect fetch be a function').to.be.a('function');
    });
  });

  describe('isBadRequestError', () => {
    it('should be a function', () => {
      expect(isBadRequestError, 'expect isBadRequestError be a function').to.be.a('function');
    });
  });

  describe('isInternalServerError', () => {
    it('should be a function', () => {
      expect(isInternalServerError, 'expect isInternalServerError be a function').to.be.a('function');
    });
  });

  describe('isHttpResponse', () => {
    it('should be a function', () => {
      expect(isHttpResponse, 'expect isHttpResponse be a function').to.be.a('function');
    });
  });

  describe('catchers', () => {
    it('should be an object', () => {
      expect(catchers, 'expect catchers be an object').to.be.a('object');
    });
  });

  describe('fetch', () => {
    it('should get http://www.test.com/resource', () => {
      const expectedBody = 'test response';
      const expectedUrl = 'http://www.test.com/resource';
      const expectedStatusText = 'ok';
      const expectedHeaders = { 'test-header': 'header value' };

      nock('http://www.test.com')
        .get('/resource')
        .reply(200, expectedBody, expectedHeaders);

      let error = null;

      const resolver = chai.spy((response) => {
        expect(isHttpResponse(response), 'expect response to be HttpResponse').to.equal(true);
        expect(response.url, `expect response.url to be '${expectedUrl}'`).to.equal(expectedUrl);
        expect(response.ok, 'expect response.ok to be true').to.equal(true);
        expect(response.isOk, 'expect response.ok to be true').to.equal(true);
        expect(response.statusText, `expect response.statusText to be '${expectedStatusText}'`).to.equal('OK');
        expect(response.headers, `expect response.headers to be deep equal '${JSON.stringify(expectedHeaders)}'`)
          .to.deep.equal(expectedHeaders);
        expect(response.body, 'expect response.body to be \'domain matched\'').to.equal(expectedBody);
        expect(response.bodyUsed).to.be.a('boolean');
        expect(response.nativeResponse.toString()).to.equal('[object Response]');
      });

      const catcher = chai.spy((err) => { error = err; });

      return fetch('http://www.test.com/resource')
        .then(resolver)
        .catch(catcher)
        .then(() => {
          if (error) {
            throw error;
          }
          expect(resolver).to.have.been.called();
          expect(catcher).to.have.not.been.called();
        });
    });

    it('should throw BadRequestError on 4XX status code', () => {
      const expectedResponse = 'Not Found';

      const resolver = chai.spy(() => {});
      const catcher = chai.spy((error) => {
        expect(isBadRequestError(error), 'expect error to be BadRequestError').to.equal(true);
        expect(error.message).to.be.a('string');
        expect(error.stack).to.be.a('string');
        expect(
          error.getResponse().body,
          `expect response.body to be '${expectedResponse}'`,
        ).to.equal(expectedResponse);
      });

      nock('http://www.test.com')
        .get('/resource')
        .reply(404, expectedResponse);

      return fetch('http://www.test.com/resource')
        .then(resolver)
        .catch(catcher)
        .then(() => {
          expect(resolver).to.have.not.been.called();
          expect(catcher).to.have.been.called();
        });
    });

    it('should return readable names for BadRequestError', () => {
      nock('http://www.test.com')
        .get('/e400')
        .reply(400, 'General Bad Request');

      nock('http://www.test.com')
        .get('/e401')
        .reply(401, 'Unauthorized');

      nock('http://www.test.com')
        .get('/e402')
        .reply(402, 'Payment Required');

      nock('http://www.test.com')
        .get('/e403')
        .reply(403, 'Access Forbidden');

      nock('http://www.test.com')
        .get('/e404')
        .reply(404, 'Not Found');

      nock('http://www.test.com')
        .get('/e422')
        .reply(422, 'Unprocessable Entity');

      return Promise.all([
        fetch('http://www.test.com/e400')
          .catch((error) => {
            expect(error.isBadRequest(), 'expect BadRequest be General Bad Request error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('BadRequestError [400 - General Bad Request]');
          }),
        fetch('http://www.test.com/e401')
          .catch((error) => {
            expect(error.isUnauthorized(), 'expect BadRequest be Unauthorized error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('BadRequestError [401 - Unauthorized]');
          }),
        fetch('http://www.test.com/e402')
          .catch((error) => {
            expect(error.toReadableString(), 'expect readable string').to.equal('BadRequestError [402]');
          }),
        fetch('http://www.test.com/e403')
          .catch((error) => {
            expect(error.isForbidden(), 'expect BadRequest be Access Forbidden error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('BadRequestError [403 - Access Forbidden]');
          }),
        fetch('http://www.test.com/e404')
          .catch((error) => {
            expect(error.isNotFound(), 'expect BadRequest be Not Found error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('BadRequestError [404 - Not Found]');
          }),
        fetch('http://www.test.com/e422')
          .catch((error) => {
            expect(error.isUnprocessableEntity(), 'expect BadRequest be Unprocessable Entity error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('BadRequestError [422 - Unprocessable Entity]');
          }),
      ]);
    });

    it('should throw InternalServerError on 5XX status code', () => {
      const expectedResponse = 'An unknown server Error!';

      const resolver = chai.spy(() => {});
      const catcher = chai.spy((error) => {
        expect(isInternalServerError(error), 'expect error to be InternalServerError').to.equal(true);
        expect(error.message).to.be.a('string');
        expect(error.stack).to.be.a('string');
        expect(
          error.getResponse().body,
          `expect response.body to be '${expectedResponse}'`,
        ).to.equal(expectedResponse);
      });

      nock('http://www.test.com')
        .get('/resource')
        .reply(500, expectedResponse);

      return fetch('http://www.test.com/resource')
        .then(resolver)
        .catch(catcher)
        .then(() => {
          expect(resolver).to.have.not.been.called();
          expect(catcher).to.have.been.called();
        });
    });

    it('should return readable names for InternalServerError', () => {
      nock('http://www.test.com')
        .get('/e500')
        .reply(500, 'Internal Server Error');

      nock('http://www.test.com')
        .get('/e501')
        .reply(501, 'Not Implemented');

      nock('http://www.test.com')
        .get('/e502')
        .reply(502, 'Bad Gateway');

      nock('http://www.test.com')
        .get('/e503')
        .reply(503, 'Service Unavailable');

      nock('http://www.test.com')
        .get('/e504')
        .reply(504, 'Gateway TimeOut');

      return Promise.all([
        fetch('http://www.test.com/e500')
          .catch((error) => {
            expect(error.isInternalServerError(), 'expect error be Internal Server Error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('InternalServerError [500 - Internal Server Error]');
          }),
        fetch('http://www.test.com/e501')
          .catch((error) => {
            expect(error.toReadableString(), 'expect readable string').to.equal('InternalServerError [501]');
          }),
        fetch('http://www.test.com/e502')
          .catch((error) => {
            expect(error.isBadGateway(), 'expect error be Bad Gateway error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('InternalServerError [502 - Bad Gateway]');
          }),
        fetch('http://www.test.com/e503')
          .catch((error) => {
            expect(error.isServiceUnavailable(), 'expect error be Service Unavailable error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('InternalServerError [503 - Service Unavailable]');
          }),
        fetch('http://www.test.com/e504')
          .catch((error) => {
            expect(error.isGatewayTimeOut(), 'expect error be Gateway TimeOut error').to.equal(true);
            expect(error.toReadableString(), 'expect readable string').to.equal('InternalServerError [504 - Gateway TimeOut]');
          }),
      ]);
    });
  });
});
