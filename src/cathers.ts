import { isBadRequestError } from './bad_request_error';
import { isInternalServerError } from './internal_server_error';
import {IHttpError, IBadRequestError, IInternalServerError, TErrorCB} from "./types";

function catcherFactory<TError>(condition :(error : any) => boolean, cb: (error: TError) => any) {
  return function catcher(error: any) {
    if (condition(error)) {
      return cb(error);
    }
    throw error;
  };
}

export default {
  /**
   * catch any bad request (4XX)
   * @param cb
   * @returns {Function}
   */
  badRequest(cb: TErrorCB<IBadRequestError>) {
    return catcherFactory((error) => isBadRequestError(error), cb);
  },
  /**
   * catch status == 400
   * @param cb
   * @returns {Function}
   */
  generalBadRequest(cb: TErrorCB<IBadRequestError>) {
    return catcherFactory((error) => (isBadRequestError(error) && error.isBadRequest()), cb);
  },
  /**
   * catch status == 400
   * @param cb
   * @returns {Function}
   */
  forbidden(cb: TErrorCB<IBadRequestError>) {
    return catcherFactory((error) => (isBadRequestError(error) && error.isForbidden()), cb);
  },
  /**
   * catch status == 404
   * @param cb
   * @returns {Function}
   */
  notFound(cb: TErrorCB<IBadRequestError>) {
    return catcherFactory((error) => (isBadRequestError(error) && error.isNotFound()), cb);
  },
  /**
   * catch status == 422
   * @param cb
   * @returns {Function}
   */
  unprocessableEntity(cb: TErrorCB<IBadRequestError>) {
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
  internalServerError(cb: TErrorCB<IInternalServerError>) {
    return catcherFactory((error) => isInternalServerError(error), cb);
  },
  /**
   * catch status == 500
   * @param cb
   * @returns {Function}
   */
  generalInternalServerError(cb: TErrorCB<IInternalServerError>) {
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
  badGateway(cb: TErrorCB<IInternalServerError>) {
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
  serviceUnavailable(cb: TErrorCB<IInternalServerError>) {
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
  gatewayTimeOut(cb: TErrorCB<IInternalServerError>) {
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
  catchStatusCode(statusCode: number, cb: TErrorCB<IHttpError>) {
    return catcherFactory(
      (error) => (
        (isBadRequestError(error) || isInternalServerError(error))
        && (error as IHttpError).getResponse().status === statusCode
      ),
      cb,
    );
  },
};
