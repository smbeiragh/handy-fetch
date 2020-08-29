import { isBadRequestError } from './bad_request_error';
import { isInternalServerError } from './internal_server_error';

function catcherFactory(condition, cb) {
  return function catcher(error) {
    if (condition(error)) {
      cb(error);
    } else {
      throw error;
    }
  };
}

export default {
  /**
   * catch any bad request (4XX)
   * @param cb
   * @returns {Function}
   */
  badRequest(cb) {
    return catcherFactory((error) => isBadRequestError(error), cb);
  },
  /**
   * catch status == 400
   * @param cb
   * @returns {Function}
   */
  generalBadRequest(cb) {
    return catcherFactory((error) => (isBadRequestError(error) && error.isBadRequest()), cb);
  },
  /**
   * catch status == 400
   * @param cb
   * @returns {Function}
   */
  forbidden(cb) {
    return catcherFactory((error) => (isBadRequestError(error) && error.isForbidden()), cb);
  },
  /**
   * catch status == 404
   * @param cb
   * @returns {Function}
   */
  notFound(cb) {
    return catcherFactory((error) => (isBadRequestError(error) && error.isNotFound()), cb);
  },
  /**
   * catch status == 422
   * @param cb
   * @returns {Function}
   */
  unprocessableEntity(cb) {
    return catcherFactory(
      (error) => (isBadRequestError(error) && error.isUnprocessableEntity()),
      cb,
    );
  },
  /**
   * catch any internal server error (5XX)
   * @param cb
   * @returns {Function}
   */
  internalServerError(cb) {
    return catcherFactory((error) => isInternalServerError(error), cb);
  },
  /**
   * catch status == 500
   * @param cb
   * @returns {Function}
   */
  generalInternalServerError(cb) {
    return catcherFactory(
      (error) => (isInternalServerError(error) && error.isInternalServerError()),
      cb,
    );
  },
  /**
   * catch status == 502
   * @param cb
   * @returns {Function}
   */
  badGateway(cb) {
    return catcherFactory(
      (error) => (isInternalServerError(error) && error.isBadGateway()),
      cb,
    );
  },
  /**
   * catch status == 503
   * @param cb
   * @returns {Function}
   */
  serviceUnavailable(cb) {
    return catcherFactory(
      (error) => (isInternalServerError(error) && error.isServiceUnavailable()),
      cb,
    );
  },
  /**
   * catch status == 504
   * @param cb
   * @returns {Function}
   */
  gatewayTimeOut(cb) {
    return catcherFactory(
      (error) => (isInternalServerError(error) && error.isGatewayTimeOut()),
      cb,
    );
  },
  /**
   * catch any 4XX or 5XX by status code
   * @param cb
   * @returns {Function}
   */
  catchStatusCode(statusCode, cb) {
    return catcherFactory(
      (error) => (
        (isBadRequestError(error) || isInternalServerError(error))
        && error.getResponse().status === statusCode
      ),
      cb,
    );
  },
};
