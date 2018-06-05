const statusToString = {
  400: 'General Bad Request',
  401: 'Unauthorized',
  403: 'Access Forbidden',
  404: 'Not Found',
  422: 'Unprocessable Entity',
};

function BadRequestError(response) {
  Error.call(this);
  Object.defineProperties(this, {
    getResponse: {
      value: function getResponse() {
        return response;
      },
      enumerable: false,
      writable: true,
      configurable: true,
    },
    message: {
      get: () => this.toReadableString(),
      configurable: true,
    },
  });

  /* istanbul ignore else  */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    Object.defineProperty(this, 'stack', {
      value: (new Error()).stack,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
}

BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;
BadRequestError.prototype.name = 'BadRequestError';

BadRequestError.prototype = Object.assign(BadRequestError.prototype, {
  toReadableString() {
    const response = this.getResponse();
    const readableName = statusToString[response.status];
    if (readableName) {
      return `BadRequestError [${response.status} - ${readableName}]`;
    }
    return `BadRequestError [${response.status}]`;
  },
  isBadRequest() {
    const response = this.getResponse();
    return response.status === 400;
  },
  isUnauthorized() {
    const response = this.getResponse();
    return response.status === 401;
  },
  isForbidden() {
    const response = this.getResponse();
    return response.status === 403;
  },
  isNotFound() {
    const response = this.getResponse();
    return response.status === 404;
  },
  isUnprocessableEntity() {
    const response = this.getResponse();
    return response.status === 422;
  },
});

export function createBadRequestError(response) {
  return new BadRequestError(response);
}

export function isBadRequestError(obj) {
  return obj instanceof BadRequestError;
}
