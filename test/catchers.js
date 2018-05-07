import chai, { expect } from 'chai';
import spies from 'chai-spies';
import nock from 'nock';
import nodeFetch from 'node-fetch';
import { fetch, catchers } from './../src';

chai.use(spies);

global.fetch = nodeFetch; // patch global fetch to simulate browser behavior
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;

describe('Catchers Basic test', () => {
  describe('catchers.badRequest', () => {
    it('should be an function', () => {
      expect(catchers.badRequest, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.badRequest(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.generalBadRequest', () => {
    it('should be an function', () => {
      expect(catchers.generalBadRequest, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.generalBadRequest(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.forbidden', () => {
    it('should be an function', () => {
      expect(catchers.forbidden, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.forbidden(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.notFound', () => {
    it('should be an function', () => {
      expect(catchers.notFound, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.notFound(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.unprocessableEntity', () => {
    it('should be an function', () => {
      expect(catchers.unprocessableEntity, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.unprocessableEntity(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.internalServerError', () => {
    it('should be an function', () => {
      expect(catchers.internalServerError, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.internalServerError(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.generalInternalServerError', () => {
    it('should be an function', () => {
      expect(catchers.generalInternalServerError, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.generalInternalServerError(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.badGateway', () => {
    it('should be an function', () => {
      expect(catchers.badGateway, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.badGateway(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.serviceUnavailable', () => {
    it('should be an function', () => {
      expect(catchers.serviceUnavailable, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.serviceUnavailable(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.gatewayTimeOut', () => {
    it('should be an function', () => {
      expect(catchers.gatewayTimeOut, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.gatewayTimeOut(() => {}), 'expect catcher return function').to.be.a('function');
    });
  });

  describe('catchers.catchStatusCode', () => {
    it('should be an function', () => {
      expect(catchers.catchStatusCode, 'expect catcher be a function').to.be.a('function');
    });
    it('should return a function', () => {
      expect(catchers.catchStatusCode(400, () => {}), 'expect catcher return function').to.be.a('function');
    });
  });
});

describe('Catchers functionality', () => {
  describe('catchers.badRequest', () => {
    it('should catch any 4XX http error', () => {
      const expectedResponse = 'bad request';

      const badRequestCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource1')
        .reply(400, expectedResponse);

      nock('http://www.test.com')
        .get('/resource2')
        .reply(499, expectedResponse);

      return Promise.all([
        fetch('http://www.test.com/resource1')
          .catch(catchers.badRequest(badRequestCatcher))
          .catch(catcher),
        fetch('http://www.test.com/resource2')
          .catch(catchers.badRequest(badRequestCatcher))
          .catch(catcher),
      ]).then(() => {
        expect(badRequestCatcher, 'expect bad request catcher to have been called twice').to.have.been.called.exactly(2);
        expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
      });
    });

    it('shouldn\'t catch none 4XX http error', () => {
      const expectedResponse = 'Internal Server Error';

      const badRequestCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(500, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.badRequest(badRequestCatcher))
        .catch(catcher)
        .then(() => {
          expect(badRequestCatcher, 'expect bad request catcher to haven\'t been called').to.have.not.been.called();
          expect(catcher, 'expect catcher to haven been called').to.have.been.called();
        });
    });
  });

  describe('catchers.generalBadRequest', () => {
    it('should catch 400 http error', () => {
      const expectedResponse = 'bad request';

      const badRequestCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(400, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.generalBadRequest(badRequestCatcher))
        .catch(catcher)
        .then(() => {
          expect(badRequestCatcher, 'expect bad request catcher to have been called').to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.forbidden', () => {
    it('should catch 403 http error', () => {
      const expectedResponse = 'forbidden';

      const badRequestCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(403, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.forbidden(badRequestCatcher))
        .catch(catcher)
        .then(() => {
          expect(badRequestCatcher, 'expect bad request catcher to have been called').to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.notFound', () => {
    it('should catch 404 http error', () => {
      const expectedResponse = 'not found';

      const badRequestCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(404, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.notFound(badRequestCatcher))
        .catch(catcher)
        .then(() => {
          expect(badRequestCatcher, 'expect bad request catcher to have been called').to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.unprocessableEntity', () => {
    it('should catch 422 http error', () => {
      const expectedResponse = 'unprocessable';

      const badRequestCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(422, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.unprocessableEntity(badRequestCatcher))
        .catch(catcher)
        .then(() => {
          expect(badRequestCatcher, 'expect bad request catcher to have been called').to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.internalServerError', () => {
    it('should catch any 5XX http error', () => {
      const expectedResponse = 'internal server error';

      const internalServerErrorCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource1')
        .reply(500, expectedResponse);

      nock('http://www.test.com')
        .get('/resource2')
        .reply(599, expectedResponse);

      return Promise.all([
        fetch('http://www.test.com/resource1')
          .catch(catchers.internalServerError(internalServerErrorCatcher))
          .catch(catcher),
        fetch('http://www.test.com/resource2')
          .catch(catchers.internalServerError(internalServerErrorCatcher))
          .catch(catcher),
      ]).then(() => {
        expect(
          internalServerErrorCatcher,
          'expect internal server error catcher to have been called twice',
        ).to.have.been.called.exactly(2);
        expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
      });
    });

    it('shouldn\'t catch none 5XX http error', () => {
      const expectedResponse = 'bad request';

      const internalServerErrorCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(499, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.internalServerError(internalServerErrorCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            internalServerErrorCatcher,
            'expect internal server error catcher to haven\'t been called',
          ).to.have.not.been.called();
          expect(catcher, 'expect catcher to haven been called').to.have.been.called();
        });
    });
  });

  describe('catchers.generalInternalServerError', () => {
    it('should catch 500 http error', () => {
      const expectedResponse = 'internal server error';

      const internalServerErrorCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(500, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.generalInternalServerError(internalServerErrorCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            internalServerErrorCatcher,
            'expect internal server error catcher to have been called',
          ).to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.badGateway', () => {
    it('should catch 502 http error', () => {
      const expectedResponse = 'internal server error';

      const internalServerErrorCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(502, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.badGateway(internalServerErrorCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            internalServerErrorCatcher,
            'expect internal server error catcher to have been called',
          ).to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.serviceUnavailable', () => {
    it('should catch 503 http error', () => {
      const expectedResponse = 'internal server error';

      const internalServerErrorCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(503, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.serviceUnavailable(internalServerErrorCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            internalServerErrorCatcher,
            'expect internal server error catcher to have been called',
          ).to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.gatewayTimeOut', () => {
    it('should catch 504 http error', () => {
      const expectedResponse = 'internal server error';

      const internalServerErrorCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(504, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.gatewayTimeOut(internalServerErrorCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            internalServerErrorCatcher,
            'expect internal server error catcher to have been called',
          ).to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.catchStatusCode', () => {
    it('should catch bad request errors by status code', () => {
      const expectedResponse = 'test!';

      const catchStatusCodeCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(400, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.catchStatusCode(400, catchStatusCodeCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            catchStatusCodeCatcher,
            'expect catch status code catcher to have been called',
          ).to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });

    it('should catch internal server errors by status code', () => {
      const expectedResponse = 'test!';

      const catchStatusCodeCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(500, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.catchStatusCode(500, catchStatusCodeCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            catchStatusCodeCatcher,
            'expect catch status code catcher to have been called',
          ).to.have.been.called();
          expect(catcher, 'expect catcher to haven\'t been called').to.have.not.been.called();
        });
    });
  });

  describe('catchers.catchStatusCode', () => {
    it('shouldn\'t catch none intended status codes', () => {
      const expectedResponse = 'test!';

      const catchStatusCodeCatcher = chai.spy(() => {});
      const catcher = chai.spy(() => {});

      nock('http://www.test.com')
        .get('/resource')
        .reply(401, expectedResponse);

      return fetch('http://www.test.com/resource')
        .catch(catchers.catchStatusCode(400, catchStatusCodeCatcher))
        .catch(catcher)
        .then(() => {
          expect(
            catchStatusCodeCatcher,
            'expect catch status code catcher to haven\'t been called',
          ).to.have.not.been.called();
          expect(catcher, 'expect catcher to haven been called').to.have.been.called();
        });
    });
  });
});
